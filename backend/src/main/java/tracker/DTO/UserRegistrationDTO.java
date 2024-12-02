package tracker.DTO;

import lombok.Data;

@Data
public class UserRegistrationDTO {
  private String authRegistrationKey;
  private UserInputDTO data;
}
