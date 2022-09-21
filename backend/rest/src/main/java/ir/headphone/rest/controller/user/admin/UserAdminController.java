package ir.headphone.rest.controller.user.admin;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.user.dto.InvoiceDto;
import ir.headphone.rest.controller.user.dto.RoleDto;
import ir.headphone.rest.controller.user.dto.UserDto;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.User;
import ir.headphone.spi.user.model.Wallet;
import ir.headphone.spi.user.service.AdminService;
import ir.headphone.spi.user.service.SubscriptionService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
public class UserAdminController extends AbstractController {
    private final AdminService adminService;
    private final SubscriptionService subscriptionService;

    public UserAdminController(AdminService adminService, SubscriptionService subscriptionService) {
        this.adminService = adminService;
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/{id}")
    public UserDto get(@PathVariable String id) {
        return new UserDto(adminService.getUserById(id));
    }

    @GetMapping("/{id}/wallet")
    public Wallet getWallet(@PathVariable String id) {
        return adminService.getWalletByUserId(id);
    }

    @PostMapping("/{id}/wallet")
    public Wallet createWallet(@PathVariable String id, @RequestBody Wallet wallet) {
        return null; //TODO
    }

    @PutMapping("/{id}/wallet")
    public Wallet updateWallet(@PathVariable String id, @RequestBody Wallet wallet) {
        return null; //TODO
    }

    @DeleteMapping("/{id}/wallet")
    public void deleteWallet(@PathVariable String id) {
        //TODO
    }

    @GetMapping("/{id}/roles")
    public Collection<RoleDto> getRole(@PathVariable String id) {
        UserDto userDto = get(id);
        List<RoleDto> result = new ArrayList<>();
        for (String role : userDto.getRoles()) {
            result.add(new RoleDto(adminService.getRole(role)));
        }
        return result;

    }

    private InvoiceDto createInvoice(Subscription s) {
        InvoiceDto invoice = new InvoiceDto();
        invoice.setConfirmed(s.getConfirmed());
        invoice.setDate(s.getPaidDate());
        invoice.setDiscount(s.getDiscount());
        invoice.setDuration(s.getDuration());
        invoice.setId(s.getId());
        invoice.setPaid(s.getPaidAmount());
        invoice.setPrice(s.getPrice());
        return invoice;
    }

    @GetMapping("/{id}/invoices")
    public Collection<InvoiceDto> getInvoices(@PathVariable String id) {
        get(id);
        Collection<? extends Subscription> subscriptions =
                subscriptionService.getUserSubscriptions(id, context.pageSize());
        List<InvoiceDto> result = new ArrayList<>();
        subscriptions.forEach(s -> {
            result.add(createInvoice(s));
        });
        return result;

    }

    @GetMapping("/{id}/invoices/{invoiceId}")
    public InvoiceDto getInvoice(@PathVariable String id, @PathVariable String invoiceId) {
        get(id);
        Subscription s = subscriptionService.getSubscription(invoiceId);
        return createInvoice(s);
    }

    @PutMapping("/{id}/roles/{roleId}")
    public void addRole(@PathVariable String id, @PathVariable String roleId) {
        adminService.assignRoleToUser(id, Collections.singleton(roleId));
    }

    @DeleteMapping("/{id}/roles/{roleId}")
    public void deleteRole(@PathVariable String id, @PathVariable String roleId) {
        adminService.unassignRoleToUser(id, Collections.singleton(roleId));
    }

    @GetMapping("")
    public Collection<UserDto> getAll(@RequestParam(required = false) String email,
                                      @RequestParam(required = false) String mobile) {
        List<UserDto> result = new ArrayList<>();
        Collection<? extends User> users;
        if (StringUtils.isNotBlank(email)) {
            users = adminService.getUsersByEmailLike(email, context.pageSize());
        } else if (StringUtils.isNotBlank(mobile)) {
            users = adminService.getUsersByMobileLike(mobile, context.pageSize());
        } else {
            users = adminService.getUsers(context.pageSize());
        }
        for (User user : users) {
            result.add(new UserDto(user));
        }
        return result;
    }

    @PostMapping("")
    public UserDto create(@RequestBody UserDto dto) {
        return new UserDto(adminService.createUser(dto.getUser()));
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable String id, @RequestBody UserDto dto) {
        get(id);
        dto.setId(id);
        return new UserDto(adminService.updateUser(dto.getUser()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteUser(id);
    }
}
