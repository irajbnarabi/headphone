package ir.headphone.rest.controller.user;

import ir.headphone.rest.controller.AbstractController;
import ir.headphone.rest.controller.user.dto.AuthenticationRequest;
import ir.headphone.rest.controller.user.dto.FavoriteListDto;
import ir.headphone.rest.controller.user.dto.InvoiceDto;
import ir.headphone.rest.controller.user.dto.RegisterRequest;
import ir.headphone.rest.controller.user.dto.SessionDto;
import ir.headphone.rest.controller.user.dto.SubscriptionRequestDto;
import ir.headphone.rest.controller.user.dto.SubscriptionResponseDto;
import ir.headphone.rest.controller.user.dto.TokenDto;
import ir.headphone.rest.controller.user.dto.UpdateCredentialRequest;
import ir.headphone.rest.controller.user.dto.UpdateProfileRequest;
import ir.headphone.rest.controller.user.dto.UserProfileDto;
import ir.headphone.rest.controller.user.dto.VerifyRequest;
import ir.headphone.rest.controller.video.dto.ProgramDto;
import ir.headphone.rest.service.impl.FileStorageService;
import ir.headphone.spi.payment.service.PaymentService;
import ir.headphone.spi.user.model.Favorite;
import ir.headphone.spi.user.model.Subscription;
import ir.headphone.spi.user.model.UserProfile;
import ir.headphone.spi.user.model.UserToken;
import ir.headphone.spi.user.service.DiscountService;
import ir.headphone.spi.user.service.SubscriptionService;
import ir.headphone.spi.user.service.TokenService;
import ir.headphone.spi.user.service.UserService;
import ir.headphone.spi.video.model.Program;
import ir.headphone.spi.video.model.ProgramType;
import ir.headphone.spi.video.service.VideoService;
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

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController extends AbstractController {
    private final UserService userService;
    private final SubscriptionService subscriptionService;
    private final PaymentService paymentService;
    private final DiscountService discountService;
    private final VideoService videoService;
    private final TokenService tokenService;
    private final FileStorageService fileStorageService;


    public UserController(UserService userService,
                          SubscriptionService subscriptionService,
                          PaymentService paymentService,
                          DiscountService discountService,
                          VideoService videoService,
                          TokenService tokenService, FileStorageService fileStorageService) {
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.paymentService = paymentService;
        this.discountService = discountService;
        this.videoService = videoService;
        this.tokenService = tokenService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/register")
    public TokenDto register(@RequestBody RegisterRequest req) {
        TokenDto tokenDto = new TokenDto(userService.register(req.getPrincipal()));
        try {
            saveEvent("register", Map.of("principal", req.getPrincipal()));
        } catch (Exception ignored) {
        }
        return tokenDto;
    }

    @PostMapping("/authenticate")
    public TokenDto authenticate(@RequestBody AuthenticationRequest req) {
        TokenDto tokenDto = new TokenDto(userService.authenticate(req.getPrincipal(), req.getCredential()));
        try {
            saveEvent("login", Map.of("principal", req.getPrincipal()));
        } catch (Exception ignored) {
        }
        return tokenDto;
    }

    @PostMapping("/verify")
    public TokenDto verify(@RequestBody VerifyRequest req) {
        return new TokenDto(userService.verify(req.getPrincipal(), req.getCode(), req.getToken()));
    }

    @PutMapping("/credentials")
    public TokenDto updateCredential(@RequestBody UpdateCredentialRequest request) {
        TokenDto tokenDto = new TokenDto(userService.updateCredential(context.userToken(), request.getCredential()));
        if (StringUtils.isNotBlank(request.getName())) {
            userService.updateProfile(userService.getUserId(tokenDto.getToken()),
                    new UserProfileDto(request.getName(), null, null));
        }
        return tokenDto;
    }

    @PostMapping("/credentials/reset")
    public TokenDto forgotCredential(@RequestBody RegisterRequest req) {
        return new TokenDto(userService.getResetPasswordToken(req.getPrincipal()));
    }

    @GetMapping("/profile")
    public UserProfileDto getUserProfile() {
        String userId = userService.getUserId(context.userToken());
        UserProfileDto userProfileDto = new UserProfileDto(userService.getProfile(userId));
        userProfileDto.setRemainedDays(subscriptionService.getRemainedSubscriptionDays(userId));
        return userProfileDto;
    }

    @PutMapping("/profile")
    public UserProfile updateUserProfile(@RequestBody UpdateProfileRequest request) {
        String userId = userService.getUserId(context.userToken());
        if (StringUtils.isNotBlank(request.getCredential())) {
            userService.updateCredential(context.userToken(), request.getCredential());
        }
        String emailUpdateToken = null;
        if (StringUtils.isNotBlank(request.getEmail())) {
            emailUpdateToken = userService.requestUpdateEmail(userId, request.getEmail());
        }
        String mobileUpdateToken = null;
        if (StringUtils.isNotBlank(request.getMobile())) {
            mobileUpdateToken = userService.requestUpdateMobile(userId, request.getMobile());
        }
        UserProfileDto profileDto = new UserProfileDto(userService.updateProfile(userId,
                new UserProfileDto(request.getName(), request.getEmail(), request.getMobile())));
        profileDto.setNewEmail(request.getEmail());
        profileDto.setNewMobile(request.getMobile());
        profileDto.setEmailUpdateToken(emailUpdateToken);
        profileDto.setMobileUpdateToken(mobileUpdateToken);
        return profileDto;
    }

    @PutMapping("/profile/principal/verify")
    public String verifyUpdateEmail(@RequestBody VerifyRequest request) {
        String userId = userService.getUserId(context.userToken());
        return userService.updatePrincipal(userId, request.getToken(), request.getPrincipal(), request.getCode());
    }

    @PostMapping("/terminate-other-sessions")
    public void terminate() {
        tokenService.deleteAllOtherUserTokens(context.userToken());
    }

    @GetMapping("/sessions")
    public List<SessionDto> getSessions() {
        Collection<? extends UserToken> sessions = tokenService.getAllSessions(userService.getUserId(context.userToken()));
        List<SessionDto> result = new ArrayList<>();
        for (UserToken session : sessions) {
            SessionDto dto = SessionDto.builder().ip(session.getIp()).device(session.getDeviceName()).lastUsage(session.getUtilizedAt()).id(session.getId()).build();
            if (tokenService.getTokenData(context.userToken()).get("t").equals(session.getId())) {
                dto.setCurrent(true);
            }
            result.add(dto);
        }
        return result;
    }

    @DeleteMapping("/sessions/{id}")
    public void deleteSession(@PathVariable String id) {
        tokenService.deleteUserTokenById(id);
    }


    @PostMapping("/logout")
    public void logout() {
        tokenService.deleteUserToken(context.userToken());
    }

    @PostMapping("/favorites/{programId}")
    public void addToFavorite(@PathVariable String programId) {
        userService.addToFavorites(userService.getUserId(context.userToken()), programId);
    }

    @DeleteMapping("/favorites/{programId}")
    public void removeFromFavorite(@PathVariable String programId) {
        userService.removeFromFavorites(userService.getUserId(context.userToken()), programId);
    }

    @GetMapping("/favorites")
    public FavoriteListDto getFavorites(@RequestParam(required = false) String type) {
        Collection<? extends Favorite> favorites = userService.getUserFavorites(userService.getUserId(context.userToken()), type, context.pageSize());
        List<ProgramDto> albums = new ArrayList<>();
        List<ProgramDto> playLists = new ArrayList<>();
        for (Favorite favorite : favorites) {
            Program program = videoService.getProgram(favorite.getProgramId());
            if (program != null && program.getEnabled()) {
                if (program.getType().equals(ProgramType.ALBUM.name())) {
                    albums.add(new ProgramDto(program, fileStorageService.prepareImages(program.getImage())));
                }
                if (program.getType().equals(ProgramType.PLAYLIST.name())) {
                    playLists.add(new ProgramDto(program, fileStorageService.prepareImages(program.getImage())));
                }
            }
        }
        return new FavoriteListDto(albums, playLists);
    }

    @PostMapping("/subscribe")
    public SubscriptionResponseDto subscribe(@RequestBody SubscriptionRequestDto dto) throws IOException {
        Subscription subscription = subscriptionService.subscribe(userService.getUserId(context.userToken()),
                dto.getPlanId(), dto.getDiscount(), dto.getProgramId());
        return new SubscriptionResponseDto(paymentService.redirect(subscription.getId(), dto.getIpgId(),
                subscription.getPrice().longValue()));
    }

    @GetMapping("/invoices")
    public List<InvoiceDto> getInvoices() {
        Collection<? extends Subscription> subscriptions =
                subscriptionService.getUserSubscriptions(userService.getUserId(context.userToken()), context.pageSize());
        List<InvoiceDto> result = new ArrayList<>();
        subscriptions.forEach(s -> {
            result.add(createInvoice(s));
        });
        return result;
    }

    @GetMapping("/invoices/{id}")
    public InvoiceDto getInvoice(@PathVariable String id) {
        Subscription s = subscriptionService.getSubscription(id);
        return createInvoice(s);
    }

    private InvoiceDto createInvoice(Subscription s) {
        InvoiceDto invoice = new InvoiceDto();
        invoice.setConfirmed(s.getConfirmed());
        invoice.setDate(s.getCreatedAt());
        invoice.setPaidDate(s.getPaidDate());
        invoice.setName(s.getName());
        invoice.setDiscount(s.getDiscount());
        invoice.setDuration(s.getDuration());
        invoice.setTimeUnit(s.getTimeUnit());
        invoice.setProgramId(s.getProgramId());
        invoice.setId(s.getId());
        invoice.setPaid(s.getPaidAmount());
        invoice.setPrice(s.getPrice());
        invoice.setType(s.getType().name());
        invoice.setDiscountVoucher(s.getDiscountVoucher());
        invoice.setVat(s.getVat());
        invoice.setVatPercent(s.getVatPercent());
        try {
            if (StringUtils.isNotBlank(s.getProgramId())) {
                Program p = videoService.getProgram(s.getProgramId());
                invoice.setProgramImage(p.getImage());
            }
        } catch (Exception ignored) {
        }
        return invoice;
    }

}
