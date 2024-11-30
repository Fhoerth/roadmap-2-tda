package tracker.controllers;

import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import tracker.models.User;

@RestController
@RequestMapping("/api/users")
public class UserController {
  private List<User> users = new ArrayList<>();

  @GetMapping
  public List<User> getAllUsers() {
    List<User> res = new ArrayList<>();
    User user1 = new User("224", "nickname", 1234);

    res.add(user1);

    return res;
  }

  @PostMapping
  public User createUser(@RequestBody User user) {
    users.add(user);
    return user;
  }
}
