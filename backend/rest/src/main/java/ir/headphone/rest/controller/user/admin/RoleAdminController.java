package ir.headphone.rest.controller.user.admin;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.user.dto.RoleDto;
import ir.headphone.spi.user.model.Role;
import ir.headphone.spi.user.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/roles")
public class RoleAdminController extends AbstractController {
    private final AdminService adminService;

    public RoleAdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("")
    public Collection<RoleDto> getAll() {
        Collection<? extends Role> roles = adminService.getRoles(context.pageSize());
        List<RoleDto> result = new ArrayList<>();
        for (Role role : roles) {
            result.add(new RoleDto(role));
        }
        return result;
    }

    @GetMapping("/{id}")
    public RoleDto get(@PathVariable String id) {
        return new RoleDto(adminService.getRole(id));
    }

    @PostMapping("")
    public RoleDto create(@RequestBody RoleDto role) {
        return new RoleDto(adminService.createRole(role.getRole()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteRole(id);
    }

    @PutMapping("/{id}")
    public RoleDto edit(@PathVariable String id, @RequestBody RoleDto role) {
        role.setId(id);
        return new RoleDto(adminService.updateRole(role.getRole()));
    }

}
