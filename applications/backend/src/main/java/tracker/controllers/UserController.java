package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.DTO.UserDTO;
import tracker.DTO.UserRegistrationDTO;
import tracker.exceptions.BadRequestException;
import tracker.providers.AuthRegistrationKeyProvider;
import tracker.services.db.UserService;
import tracker.utils.Logger;

@RestController
@RequestMapping("/api/user")
public class UserController {
  private UserService userService;
  private AuthRegistrationKeyProvider authRegistrationKeyProvider;

  @Autowired
  public UserController(UserService userService, AuthRegistrationKeyProvider authRegistrationKeyProvider) {
    this.userService = userService;
    this.authRegistrationKeyProvider = authRegistrationKeyProvider;
  }

  @GetMapping
  public List<UserDTO> get() {
    return userService.getAllUsers();
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
