package tracker.token;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import lombok.Data;
import tracker.models.User;

@Data
public class Token {
  @JsonProperty("user")
  private User user;

  @JsonProperty("timestamp")
  private Long timestamp;

  // spotless:off
  public Token() {}
  // spotless:on

  public Token(User user) {
    this.user = user;
    this.timestamp = Instant.now().toEpochMilli();
  }
}
