package tracker.dto2;

import lombok.Data;

@Data
public class UserRegistrationDTO {
  private String authRegistrationKey;
  private UserInputDTO data;
}
