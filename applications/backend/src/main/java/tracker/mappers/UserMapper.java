package tracker.mappers;

import java.util.List;
import java.util.stream.Collectors;
import tracker.DTO.UserDTO;
import tracker.models.User;

public class UserMapper {
  public static UserDTO toDTO(User user) {
    return new UserDTO(user.getId(), user.getNickname());
  }

  public static List<UserDTO> toDTOList(List<User> users) {
    return users.stream().map(UserMapper::toDTO).collect(Collectors.toList());
  }
}
