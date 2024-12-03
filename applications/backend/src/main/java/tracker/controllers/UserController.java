package tracker.controllers;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.StatusDTO;
import tracker.DTO.UserDTO;
import tracker.DTO.UserLoginDTO;
import tracker.DTO.UserRegistrationDTO;
import tracker.auth.Auth;
import tracker.auth.AuthCookie;
import tracker.exceptions.BadRequestException;
import tracker.models.User;
import tracker.providers.AuthRegistrationKeyProvider;
import tracker.services.db.UserService;
import tracker.utils.Logger;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private UserService userService;
  private AuthRegistrationKeyProvider authRegistrationKeyProvider;
  private AuthCookie authCookie;

  @Autowired
  public UserController(UserService userService, AuthRegistrationKeyProvider authRegistrationKeyProvider,
      AuthCookie authCookie) {
    this.userService = userService;
    this.authRegistrationKeyProvider = authRegistrationKeyProvider;
    this.authCookie = authCookie;
  }

  @GetMapping
  public List<UserDTO> get() {
    return userService.getAllUsers();
  }

  @PostMapping("/login")
  public UserDTO login(@RequestBody UserLoginDTO input, HttpServletResponse response) {
    User user = userService.getUser(input);
    Cookie cookie = authCookie.createSecureAuthCookie(user);

    response.addCookie(cookie);

    return new UserDTO(user.getId(), user.getNickname());
  }

  @Auth
  @PostMapping("/logout")
  public StatusDTO logout(HttpServletResponse response) {
    response.addCookie(authCookie.createExpiedCookie());

    return new StatusDTO("OK");
  }

  @PostMapping("/create")
  public UserDTO create(@RequestBody UserRegistrationDTO input) {
    if (!input.getAuthRegistrationKey().equals(authRegistrationKeyProvider.key())) {
      throw new BadRequestException("Wrong Auth Registration Key");
    }

    Logger.printBlue("Creating user " + input.getData());

    return userService.createUser(input.getData());
  }
}
