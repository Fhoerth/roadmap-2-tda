package tracker.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.ALWAYS)
public class SubmissionDTO {
  @JsonProperty("submissionId")
  private String submissionId;

  @JsonProperty("accepted")
  private boolean accepted;

  @JsonProperty("image")
  private String image;

  @JsonProperty("problemSlug")
  private String problemSlug;

  @JsonProperty("sourceCode")
  private String sourceCode;
}
