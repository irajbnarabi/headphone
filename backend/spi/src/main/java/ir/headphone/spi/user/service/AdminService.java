package ir.headphone.spi.user.service;

import ir.headphone.spi.model.PageSize;
import ir.headphone.spi.user.model.Role;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.model.Wallet;

import java.util.Collection;
import java.util.Set;

public interface AdminService {
    Collection<? extends User> getUsers(PageSize pageSize);

    User createUser(User user);

    User getUserById(String userId);

    User getUserByEmail(String email);

    Collection<? extends User> getUsersByEmailLike(String email, PageSize pageSize);

    User getUserByMobile(String mobile);

    Collection<? extends User> getUsersByMobileLike(String mobile, PageSize pageSize);

    User updateUser(User user);

    void deleteUser(String userId);

    void updatePassword(String userId, String password);

    Rule getRule(String ruleId);

    Role getRole(String roleName);

    Role updateRole(Role role);

    Role createRole(Role role);

    Rule updateRule(Rule rule);

    Rule createRule(Rule rule);

    void assignRoleToUser(String userId, Set<String> roleIds);

    void unassignRoleToUser(String userId, Set<String> roleIds);

    void deleteRole(String roleId);

    void deleteRule(String ruleId);

    Collection<? extends Rule> getRules(PageSize pageSize);

    Collection<? extends Role> getRoles(PageSize pageSize);

    Wallet getWalletByUserId(String userId);

    Wallet updateWallet(Wallet wallet);

    void deleteFavoritesByProgramId(String programId);
}
