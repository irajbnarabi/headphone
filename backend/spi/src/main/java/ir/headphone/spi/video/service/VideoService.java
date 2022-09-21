package ir.headphone.spi.video.service;


import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.VideoBinding;

import java.util.Collection;

public interface VideoService {
    VideoBinding getVideoBinding(String id);

    VideoBinding createVideoBinding(VideoBinding videoBinding);

    void unbindVideo(String ig);

    Collection<VideoBinding> getVideoBindings(String programId, PageSize pageSize);

    VideoBinding getVideoBindingByVideoId(String videoId);

    VideoBinding getVideoBindingByProgramId(String programId, Integer seasonNumber, Integer episodeNumber);

    Collection<VideoBinding> getVideoBindings(String programId, Integer seasonNumber, PageSize pageSize);

    Program getProgram(String id);

    Program createProgram(Program program);

    Collection<Program> getPrograms(ProgramType type, PageSize pageSize);

    Collection<Program> getProgramsByPrefix(String prefix, ProgramType type, PageSize pageSize);

    Collection<Program> getLatestPrograms(ProgramType type, PageSize pageSize);

    Collection<Program> getProgramsByTag(String tagId, ProgramType type, PageSize pageSize);

    Long getCount(ProgramType type);

    void deleteProgram(String id);
}
