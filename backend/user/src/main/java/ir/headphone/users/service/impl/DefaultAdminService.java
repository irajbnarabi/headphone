package ir.headphone.users.service.impl;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Role;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.model.Wallet;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.users.error.InvalidInput;
import ir.headphone.users.error.RoleNotFound;
import ir.headphone.users.error.RuleNotFound;
import ir.headphone.users.error.UserNotFound;
import ir.headphone.users.model.entity.CredentialEntity;
import ir.headphone.users.model.entity.RoleEntity;
import ir.headphone.users.model.entity.RuleEntity;
import ir.headphone.users.model.entity.UserEntity;
import ir.headphone.users.model.entity.WalletEntity;
import ir.headphone.users.repository.CredentialRepository;
import ir.headphone.users.repository.FavoriteRepository;
import ir.headphone.users.repository.RoleRepository;
import ir.headphone.users.repository.RuleRepository;
import ir.headphone.users.repository.UserRepository;
import ir.headphone.users.repository.UserTokenRepository;
import ir.headphone.users.repository.WalletRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Service
public class DefaultAdminService implements AdminService {
    private final UserRepository userRepository;
    private final RuleRepository ruleRepository;
    private final RoleRepository roleRepository;
    private final CredentialRepository credentialRepository;
    private final WalletRepository walletRepository;
    private final UserTokenRepository userTokenRepository;
    private final FavoriteRepository favoriteRepository;

    public DefaultAdminService(UserRepository userRepository, RuleRepository ruleRepository,
                               RoleRepository roleRepository, CredentialRepository credentialRepository,
                               WalletRepository walletRepository, UserTokenRepository userTokenRepository, FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.ruleRepository = ruleRepository;
        this.roleRepository = roleRepository;
        this.credentialRepository = credentialRepository;
        this.walletRepository = walletRepository;
        this.userTokenRepository = userTokenRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public Collection<? extends User> getUsers(PageSize pageSize) {
        return userRepository.findAll(PageRequest.of(pageSize.getPage(), pageSize.getSize())).toList();
    }

    @Override
    public User createUser(User user) {
        user.setId(null);
        return userRepository.save(new UserEntity(user));
    }

    @Override
    public User getUserById(String userId) {
        if (StringUtils.isEmpty(userId)) {
            throw new InvalidInput();
        }
        Optional<UserEntity> user = userRepository.findById(userId);
        if (!user.isPresent()) {
            throw new UserNotFound();
        }
        return user.get();
    }

    @Override
    public User getUserByEmail(String email) {
        if (StringUtils.isEmpty(email)) {
            throw new InvalidInput();
        }
        UserEntity user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFound();
        }
        return user;
    }

    @Override
    public Collection<? extends User> getUsersByEmailLike(String email, PageSize pageSize) {
        if (StringUtils.isBlank(email)) {
            throw new InvalidInput();
        }
        return userRepository.findByEmailLike(email, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public User getUserByMobile(String mobile) {
        if (StringUtils.isEmpty(mobile)) {
            throw new InvalidInput();
        }
        UserEntity user = userRepository.findByMobile(mobile);
        if (user == null) {
            throw new UserNotFound();
        }
        return user;
    }

    @Override
    public Collection<? extends User> getUsersByMobileLike(String mobile, PageSize pageSize) {
        if (StringUtils.isBlank(mobile)) {
            throw new InvalidInput();
        }
        return userRepository.findByMobileLike(mobile, PageRequest.of(pageSize.getPage(), pageSize.getSize()));
    }

    @Override
    public User updateUser(User user) {
        if (StringUtils.isEmpty(user.getId())) {
            throw new InvalidInput();
        }
        return userRepository.save(new UserEntity(user));
    }

    @Override
    public void deleteUser(String userId) {
        User user = getUserById(userId);
        userRepository.deleteById(user.getId());
    }

    @Override
    public void updatePassword(String userId, String password) {
        User user = getUserById(userId);
        CredentialEntity passEntity = credentialRepository.findByUserId(user.getId());
        CredentialEntity pass = CredentialEntity.builder()
                .userId(userId)
                .build();
        if (passEntity != null) {
            pass = passEntity;
        }
        pass.setCredential(DigestUtils.sha1Hex(password));
        credentialRepository.save(pass);
    }

    @Override
    public Role getRole(String roleName) {
        RoleEntity role = roleRepository.findByName(roleName);
        if (role == null) {
            Optional<RoleEntity> byId = roleRepository.findById(roleName);
            if (!byId.isPresent()) {
                throw new RoleNotFound();
            }
            return byId.get();
        }
        return role;
    }

    @Override
    public Rule getRule(String ruleId) {
        Optional<RuleEntity> rule = ruleRepository.findById(ruleId);
        if (!rule.isPresent()) {
            throw new RuleNotFound();
        }
        return rule.get();
    }

    @Override
    public Role updateRole(Role role) {
        if (StringUtils.isBlank(role.getName()) || role.getName().contains(",")) {
            throw new InvalidInput("invalid role's name");
        }
        return roleRepository.save(new RoleEntity(role));
    }

    @Override
    public Role createRole(Role role) {
        role.setId(null);
        if (StringUtils.isBlank(role.getName()) || role.getName().contains(",")) {
            throw new InvalidInput("invalid role's name");
        }
        return roleRepository.save(new RoleEntity(role));
    }

    @Override
    public Rule updateRule(Rule rule) {
        return ruleRepository.save(new RuleEntity(rule));
    }

    @Override
    public Rule createRule(Rule rule) {
        rule.setId(null);
        return ruleRepository.save(new RuleEntity(rule));
    }

    @Override
    public void assignRoleToUser(String userId, Set<String> roleIds) {
        UserEntity user = (UserEntity) getUserById(userId);
        user.setRoles(roleIds);
        userRepository.save(user);
    }

    @Override
    public void unassignRoleToUser(String userId, Set<String> roleIds) {
        UserEntity user = (UserEntity) getUserById(userId);
        for (String roleId : roleIds) {
            user.getRoles().remove(roleId);
        }
        userRepository.save(user);
    }

    @Override
    public void deleteRole(String roleId) {
        Role role = getRole(roleId);
        roleRepository.deleteById(role.getId());
    }

    @Override
    public void deleteRule(String ruleId) {
        Rule rule = getRule(ruleId);
        ruleRepository.deleteById(rule.getId());
    }

    @Override
    public Collection<? extends Rule> getRules(PageSize pageSize) {
        return ruleRepository.findAll(PageRequest.of(pageSize.getPage(), pageSize.getSize())).toList();
    }

    @Override
    public Collection<? extends Role> getRoles(PageSize pageSize) {
        return roleRepository.findAll(PageRequest.of(pageSize.getPage(), pageSize.getSize())).toList();
    }

    @Override
    public Wallet getWalletByUserId(String userId) {
        User user = getUserById(userId);
        return new WalletEntity(walletRepository.findByUserId(user.getId()));
    }

    @Override
    public Wallet updateWallet(Wallet wallet) {
        return new WalletEntity(walletRepository.save(new WalletEntity(wallet)));
    }

    @Override
    public void deleteFavoritesByProgramId(String programId) {
        favoriteRepository.deleteByProgramId(programId);
    }
}
