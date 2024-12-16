package tracker.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.ALWAYS)
public class RecentAcceptedSubmissionsDTO {
  @JsonProperty("data")
  private DataDTO data;

  @Data
  @JsonInclude(JsonInclude.Include.ALWAYS)
  public static class DataDTO {
    @JsonProperty("recentAcSubmissionList")
    private List<SubmissionDTO> recentAcSubmissionList;
  }

  @Data
  @JsonInclude(JsonInclude.Include.ALWAYS)
  public static class SubmissionDTO {
    @JsonProperty("id")
    private String id;

    @JsonProperty("title")
    private String title;

    @JsonProperty("titleSlug")
    private String titleSlug;

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("statusDisplay")
    private String statusDisplay;

    @JsonProperty("lang")
    private String lang;
  }
}
