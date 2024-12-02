package tracker.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.dto.UserDTO;
import tracker.dto.UserInputDTO;
import tracker.mappers.UserMapper;
import tracker.models.User;
import tracker.repositories.UserRepository;

@Service
public class UserService {
  private UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public List<UserDTO> getAllUsers() {
    return UserMapper.toDTOList(userRepository.findAll());
  }

  public UserDTO createUser(UserInputDTO input) {
    User user = new User(input.lu(), input.nickname(), input.pin());

    userRepository.save(user);

    return new UserDTO(user.getId(), user.getNickname());
  }
}
