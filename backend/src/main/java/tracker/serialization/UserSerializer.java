package tracker.serialization;

import com.fasterxml.jackson.core.JsonProcessingException;
import tracker.models.User;

public class UserSerializer {
  public static String serialize(User user) throws JsonProcessingException {
    return UserObjectMapper.getMapper().writeValueAsString(user);
  }
}
