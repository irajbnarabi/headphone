package ir.headphone.search.service;

import ir.headphone.search.error.SearchException;
import ir.headphone.search.model.ProgramIndex;
import ir.headphone.search.model.TagIndex;
import ir.headphone.search.repository.ProgramRepository;
import ir.headphone.search.repository.TagRepository;
import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.search.service.SearchService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import org.apache.logging.log4j.LogManager;
import org.elasticsearch.common.lucene.search.function.CombineFunction;
import org.elasticsearch.common.lucene.search.function.FunctionScoreQuery;
import org.elasticsearch.index.query.MultiMatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.functionscore.FunctionScoreQueryBuilder;
import org.elasticsearch.index.query.functionscore.GaussDecayFunctionBuilder;
import org.elasticsearch.index.query.functionscore.ScoreFunctionBuilders;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.logging.Logger;

import static org.elasticsearch.index.query.QueryBuilders.multiMatchQuery;

public class ElasticSearchService implements SearchService {
    private static VideoService videoService;
    private static TagService tagService;
    private static Boolean jobStarted = false;
    private final ProgramRepository programRepository;
    private final TagRepository tagRepository;
    private final org.apache.logging.log4j.Logger logger = LogManager.getLogger();

    public ElasticSearchService(ProgramRepository programRepository, TagRepository tagRepository) {
        this.programRepository = programRepository;
        this.tagRepository = tagRepository;
    }

    public static void setVideoService(VideoService videoService) {
        ElasticSearchService.videoService = videoService;
    }

    public static void setTagService(TagService tagService) {
        ElasticSearchService.tagService = tagService;
    }

    @Override
    public Collection<ProgramIndex> searchPrograms(String q, ProgramType type, PageSize pageSize) {
        MultiMatchQueryBuilder multiMatchQueryBuilder = multiMatchQuery(q)
                .field("id", 30)
                .field("title", 50)
                .field("description", 30)
                .slop(5)
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)
                .lenient(true);
        Query searchQuery = getQuery(multiMatchQueryBuilder, pageSize, type);

        return programRepository.search(searchQuery).toList(); //TODO replace deprecated methods
    }

    @Override
    public Collection<TagIndex> searchTags(String q, PageSize pageSize) {
        MultiMatchQueryBuilder multiMatchQueryBuilder = multiMatchQuery(q)
                .field("id", 30)
                .field("tagDefinitionId", 30)
                .field("tagDefinitionName", 40)
                .field("value", 40)
                .slop(5)
                .type(MultiMatchQueryBuilder.Type.PHRASE_PREFIX)
                .lenient(true);

        Query searchQuery = getQuery(multiMatchQueryBuilder, pageSize, null);

        return tagRepository.search(searchQuery).toList(); //TODO replace deprecated methods
    }

    private Query getQuery(MultiMatchQueryBuilder multiMatchQueryBuilder, PageSize pageSize, ProgramType type) {
        GaussDecayFunctionBuilder decayFunction = ScoreFunctionBuilders.gaussDecayFunction("updatedAt",
                Instant.now().toEpochMilli(), Duration.ofDays(7).toMillis(), Duration.ofDays(0).toMillis(), 0.5);
        final FunctionScoreQueryBuilder functionScoreQuery = QueryBuilders.functionScoreQuery(multiMatchQueryBuilder);
        functionScoreQuery.scoreMode(FunctionScoreQuery.ScoreMode.MULTIPLY);
        functionScoreQuery.boostMode(CombineFunction.MULTIPLY);

        NativeSearchQueryBuilder queryBuilder = new NativeSearchQueryBuilder()
                .withQuery(functionScoreQuery)
                .withPageable(PageRequest.of(pageSize.getPage(), pageSize.getSize()));

        if (type != null) {
            queryBuilder.withFilter(QueryBuilders.wildcardQuery("type", type.name()));
        }
        return queryBuilder.build();
    }

    @EventListener
    public void processEvents(String event) {
        logger.info("event received: " + event);
        String[] parts = event.split("\\|");
        String id = parts[1];
        switch (parts[0]) {
            case "deleteProgram":
                programRepository.deleteById(id);
                break;
            case "updateProgram":
                ProgramIndex index = new ProgramIndex(videoService.getProgram(id));
                index.setIndexedAt(System.currentTimeMillis());
                programRepository.save(index);
                break;
            case "deleteTag":
                tagRepository.deleteById(id);
                break;
            case "updateTag":
                Tag tag = tagService.getTag(id);
                TagIndex tagIndex = new TagIndex(tag);
                TagDefinition definition = tagService.getTagDefinition(tag.getTagDefinitionId());
                if(definition.getName().equals("crew")){
                    tagIndex.setTagDefinitionName(definition.getName());
                    tagIndex.setIndexedAt(System.currentTimeMillis());
                    tagRepository.save(tagIndex);
                }
                break;
        }
    }

    @Scheduled(cron = "0 0 * * * *")
    @Async
    public void updateDataBase() {
        if (jobStarted) {
            return;
        }
        jobStarted = true;
        try {
            if (videoService == null) {
                throw new SearchException("videoService is null");
            }
            int page = 0;
            Collection<Program> programs = videoService.getPrograms(null, PageSize.of(page++, 1000));
            while (programs != null && programs.size() > 0) {
                for (Program program : programs) {
                    ProgramIndex index = new ProgramIndex(program);
                    index.setIndexedAt(System.currentTimeMillis());
                    programRepository.save(index);
                }
                Logger.getGlobal().info("update " + programs.size() + " programs");
                programs = videoService.getPrograms(null, PageSize.of(page++, 1000));
            }

            page = 0;
            Collection<? extends Tag> tags = tagService.getTagsByDefinition("crew", PageSize.of(page++, 1000));
            while (tags != null && tags.size() > 0) {
                for (Tag tag : tags) {
                    TagIndex index = new TagIndex(tag);
                    TagDefinition definition = tagService.getTagDefinition(tag.getTagDefinitionId());
                    index.setTagDefinitionName(definition.getName());
                    index.setIndexedAt(System.currentTimeMillis());
                    tagRepository.save(index);
                }
                Logger.getGlobal().info("update " + tags.size() + " tags");
                tags = tagService.getTags(PageSize.of(page++, 1000));
            }
        } finally {
            jobStarted = false;
        }
    }
}
