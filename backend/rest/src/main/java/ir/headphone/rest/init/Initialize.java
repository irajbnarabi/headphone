package ir.headphone.rest.init;

import ir.headphone.rest.controller.home.HomeController;
import ir.headphone.rest.logger.Logger;
import ir.headphone.rest.service.impl.FileStorageService;
import ir.headphone.search.service.ElasticSearchService;
import ir.headphone.spi.user.model.Role;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.video.model.TagDefinition;
import ir.headphone.spi.video.service.TagService;
import ir.headphone.spi.video.service.VideoService;
import ir.headphone.users.error.UserNotFound;
import ir.headphone.users.model.entity.CredentialEntity;
import ir.headphone.users.model.entity.RoleEntity;
import ir.headphone.users.model.entity.RuleEntity;
import ir.headphone.users.model.entity.UserEntity;
import ir.headphone.users.repository.CredentialRepository;
import ir.headphone.videos.error.TagDefinitionNotFound;
import ir.headphone.videos.error.TagNotFound;
import ir.headphone.videos.model.entity.TagDefinitionEntity;
import ir.headphone.videos.model.entity.TagEntity;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.scheduling.concurrent.ConcurrentTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.concurrent.Executors;

@Component
public class Initialize implements InitializingBean {
    private final VideoService videoService;
    private final TagService tagService;
    private final FileStorageService fileStorageService;
    private final HomeController homeController;
    private final ElasticSearchService elasticSearchService;
    private final ConcurrentTaskExecutor executor;
    private final AdminService adminService;
    private final CredentialRepository credentialRepository;
    private final InitConfig initConfig;
    private final org.apache.logging.log4j.Logger logger = Logger.getInstance(Initialize.class);

    public Initialize(TagService tagService, VideoService videoService, FileStorageService fileStorageService,
                      HomeController homeController, ElasticSearchService elasticSearchService,
                      AdminService adminService, CredentialRepository credentialRepository, InitConfig initConfig) {
        this.tagService = tagService;
        this.videoService = videoService;
        this.fileStorageService = fileStorageService;
        this.homeController = homeController;
        this.elasticSearchService = elasticSearchService;
        this.adminService = adminService;
        this.credentialRepository = credentialRepository;
        this.initConfig = initConfig;
        executor = new ConcurrentTaskExecutor(Executors.newFixedThreadPool(32));
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        ElasticSearchService.setVideoService(videoService);
        ElasticSearchService.setTagService(tagService);

        createSuperAdmin();
        addInitTags();
    }

    private void createSuperAdmin() {
        try {
            adminService.getUserByEmail("admin@panel.ext");
            logger.info("admin is already created");
        } catch (UserNotFound ex) {
            Rule rule = adminService.createRule(
                    RuleEntity.builder().name("all").path("*").method("*").build()
            );
            Role role = adminService.createRole(
                    RoleEntity.builder().name("super-admin").rules(Collections.singleton(rule.getId())).build()
            );
            User user = adminService.createUser(
                    UserEntity.builder().name("admin").email("admin@panel.ext").roles(Collections.singleton(role.getId())).build()
            );

            String random = RandomStringUtils.randomAlphanumeric(8);
            credentialRepository.save(CredentialEntity.builder().userId(user.getId())
                    .credential(DigestUtils.md5Hex(random)).build());
            logger.info("default admin with credential " + random + " is created");
        }

    }

    private void addInitTags() {
        for (TagDefinitionEntity definition : initConfig.getDefinitions()) {
            try {
                tagService.getTagDefinitionByName(definition.getName());
            } catch (Exception ex) {
                tagService.createTagDefinition(definition);
                logger.info("tag-def: " + definition.getName() + " is created");
            }
        }
        for (TagEntity tag : initConfig.getTags()) {
            try {
                TagDefinition def = tagService.getTagDefinitionByName(tag.getTagDefinitionId());
                tag.setTagDefinitionId(def.getId());
                try {
                    tagService.getTag(tag.getTagDefinitionId(), tag.getValue());
                } catch (TagNotFound e) {
                    tagService.createTag(tag);
                    logger.info("tag:" + tag.getValue() + " is created");
                }
            } catch (TagDefinitionNotFound ignored) {
            }
        }
    }

}
