package tracker.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tracker.dto.UserDTO;
import tracker.dto.UserInputDTO;
import tracker.services.UserService;
import tracker.utils.Logger;

@RestController
@RequestMapping("/api/users")
public class UserController {
  @Autowired
  private UserService userService;

  @GetMapping
  public List<UserDTO> getAllUsers() {
    return userService.getAllUsers();
  }

  @PostMapping
  public UserDTO createUser(@RequestBody UserInputDTO user) {
    Logger.printBlue("Creating user " + user);
    return userService.createUser(user);
  }
}
