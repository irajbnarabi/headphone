package ir.headphone.helper.db;

import ir.headphone.spi.model.Entity;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface Repository<T extends Entity> extends PagingAndSortingRepository<T, String> {

}
