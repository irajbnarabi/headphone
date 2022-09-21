package ir.headphone.spi.search.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.model.Tag;

import java.util.Collection;

public interface SearchService {
    Collection<? extends Program> searchPrograms(String q, ProgramType type, PageSize pageSize);

    Collection<? extends Tag> searchTags(String q, PageSize pageSize);

    void updateDataBase();
}
