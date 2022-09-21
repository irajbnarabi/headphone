package ir.headphone.users.repository.impl.mongodb;

import ir.headphone.helper.db.mongodb.AbstractMongodbRepository;
import ir.headphone.users.model.entity.FavoriteEntity;
import ir.headphone.users.model.entity.QFavoriteEntity;
import ir.headphone.users.repository.FavoriteRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.repository.support.SpringDataMongodbQuery;

import java.util.List;

public class DefaultFavoriteRepository extends AbstractMongodbRepository<FavoriteEntity> implements FavoriteRepository {
    private static final QFavoriteEntity q = QFavoriteEntity.favoriteEntity;

    public DefaultFavoriteRepository(MongoDatabaseFactory mongoDatabaseFactory) {
        super(mongoDatabaseFactory, FavoriteEntity.class);
    }

    @Override
    public FavoriteEntity findByUserIdAndProgramId(String userId, String programId) {
        return dsl()
                .where(q.userId.eq(userId), q.programId.eq(programId))
                .fetchOne();
    }

    @Override
    public List<FavoriteEntity> findAllByUserIdAndType(String userId, String type, PageRequest pageRequest) {
        SpringDataMongodbQuery<FavoriteEntity> dsl = dsl(pageRequest).where(q.userId.eq(userId));
        if (StringUtils.isNotBlank(type)) {
            dsl.where(q.type.eq(type));
        }
        dsl.orderBy(q.updatedAt.desc());
        return dsl.fetch();
    }

    @Override
    public void deleteByProgramId(String programId) {
        int page = 0;
        List<FavoriteEntity> list = dsl(PageRequest.of(page++, 1000)).where(q.programId.eq(programId)).fetch();
        while (list.size() > 0) {
            deleteAll(list);
            list = dsl(PageRequest.of(page++, 1000)).where(q.programId.eq(programId)).fetch();
        }
    }
}
