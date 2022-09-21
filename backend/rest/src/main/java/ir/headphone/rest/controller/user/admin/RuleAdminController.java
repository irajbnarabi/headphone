package ir.headphone.rest.controller.user.admin;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.user.dto.RuleDto;
import ir.headphone.spi.user.model.Rule;
import ir.headphone.spi.user.service.AdminService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/rules")
public class RuleAdminController extends AbstractController {
    private final AdminService adminService;

    public RuleAdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("")
    public Collection<RuleDto> getAll() {
        Collection<? extends Rule> rules = adminService.getRules(context.pageSize());
        List<RuleDto> result = new ArrayList<>();
        for (Rule rule : rules) {
            result.add(new RuleDto(rule));
        }
        return result;
    }

    @GetMapping("/{id}")
    public RuleDto get(@PathVariable String id) {
        return new RuleDto(adminService.getRule(id));
    }

    @PostMapping("")
    public RuleDto create(@RequestBody RuleDto rule) {
        return new RuleDto(adminService.createRule(rule.getRule()));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        adminService.deleteRule(id);
    }

    @PutMapping("/{id}")
    public RuleDto edit(@PathVariable String id, @RequestBody RuleDto rule) {
        rule.setId(id);
        return new RuleDto(adminService.updateRule(rule.getRule()));
    }

}
