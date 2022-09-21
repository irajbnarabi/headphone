package ir.headphone.social.service.impl;

import ir.headphone.social.error.InvalidRate;
import ir.headphone.social.model.entity.AvgRateEntity;
import ir.headphone.social.model.entity.LikeEntity;
import ir.headphone.social.model.entity.RateEntity;
import ir.headphone.social.repository.AvgRateRepository;
import ir.headphone.social.repository.LikeRepository;
import ir.headphone.social.repository.RateRepository;
import ir.headphone.spi.social.SocialService;
import ir.headphone.spi.social.model.AvgRate;

public class DefaultSocialService implements SocialService {
    private final LikeRepository likeRepository;
    private final RateRepository rateRepository;
    private final AvgRateRepository avgRateRepository;

    public DefaultSocialService(LikeRepository likeRepository, RateRepository rateRepository, AvgRateRepository avgRateRepository) {
        this.likeRepository = likeRepository;
        this.rateRepository = rateRepository;
        this.avgRateRepository = avgRateRepository;
    }

    @Override
    public void like(String userId, String entityId, boolean set) {
        doAction(userId, entityId, set, false);
    }

    @Override
    public void dislike(String userId, String entityId, boolean set) {
        doAction(userId, entityId, set, true);
    }

    private void doAction(String userId, String entityId, boolean set, boolean dislike) {
        LikeEntity entity = likeRepository.getByUserIdAndEntityId(userId, entityId);
        if (set) {
            if (entity == null) {
                likeRepository.save(LikeEntity.builder().userId(userId).entityId(entityId).dislike(dislike).build());
            } else {
                entity.setDislike(dislike);
                likeRepository.save(entity);
            }
        } else {
            if (entity != null) {
                likeRepository.deleteById(entity.getId());
            }
        }
    }

    @Override
    public Long getLikeCount(String entityId) {
        return likeRepository.countByEntityIdAndDislike(entityId, false);
    }

    @Override
    public Long getDislikeCount(String entityId) {
        return likeRepository.countByEntityIdAndDislike(entityId, true);
    }

    @Override
    public Boolean isLiked(String userId, String entityId) {
        LikeEntity entity = likeRepository.getByUserIdAndEntityId(userId, entityId);
        return entity != null && !entity.getDislike();
    }

    @Override
    public Boolean isDisliked(String userId, String entityId) {
        LikeEntity entity = likeRepository.getByUserIdAndEntityId(userId, entityId);
        return entity != null && entity.getDislike();
    }

    @Override
    public void rate(String userId, String entityId, Integer rate) {
        if (rate < 1 || rate > 5) {
            throw new InvalidRate();
        }
        RateEntity rateEntity = rateRepository.getByUserIdAndEntityId(userId, entityId);
        Integer currentRate = 0;
        Integer currentCount = 0;
        if (rateEntity == null) {
            rateEntity = RateEntity.builder().userId(userId).entityId(entityId).build();
        } else {
            currentRate = rateEntity.getRate();
            currentCount = 1;
        }
        rateEntity.setRate(rate);
        rateRepository.save(rateEntity);
        AvgRateEntity avgRate = avgRateRepository.getAvgRateByEntityId(entityId);
        if (avgRate == null) {
            avgRate = AvgRateEntity.builder().rate(Float.valueOf(rate)).entityId(entityId).rateCount(1L).build();
            avgRateRepository.save(avgRate);
            return;
        }
        Long count = avgRate.getRateCount();
        float sum = (avgRate.getRate() * count) + Float.valueOf(rate);
        count = count + 1 - currentCount;
        sum = sum - currentRate;
        Float r = sum / count;
        avgRate.setRate(r);
        avgRate.setRateCount(count + 1 - currentCount);
        avgRateRepository.save(avgRate);
    }

    @Override
    public AvgRate getAvgRate(String entityId) {
        return avgRateRepository.getAvgRateByEntityId(entityId);
    }

    @Override
    public Integer getUserRate(String userId, String entityId) {
        RateEntity rateEntity = rateRepository.getByUserIdAndEntityId(userId, entityId);
        if (rateEntity == null) {
            return null;
        }
        return rateEntity.getRate();
    }
}
