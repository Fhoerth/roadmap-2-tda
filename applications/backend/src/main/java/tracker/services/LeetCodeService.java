package tracker.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.DTO.SubmissionDTO;
import tracker.exceptions.SubmissionRequestException;
import tracker.providers.LeetCodeServiceApiUrlProvider;
import tracker.utils.Logger;

@Service
public class LeetCodeService {
  private final HttpClient client;
  private final String leetCodeServiceApiUrl;
  private final ObjectMapper objectMapper;

  @Autowired
  public LeetCodeService(LeetCodeServiceApiUrlProvider leetCodeServiceApiUrlProvider) {
    this.client = HttpClient.newHttpClient();
    this.leetCodeServiceApiUrl = leetCodeServiceApiUrlProvider.getLeetCodeServiceApiUrl();
    this.objectMapper = new ObjectMapper();
  }

  private HttpResponse<String> makeRequest(String path) throws Exception {
    String url = String.format("%s%s", this.leetCodeServiceApiUrl, path);
    Logger.printPurple(url);

    HttpRequest request = HttpRequest.newBuilder().uri(new URI(url)).header("Accept", "application/json").GET().build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

    return response;
  }

  public SubmissionDTO fetchSubmission(String submissionId) throws SubmissionRequestException {
    String path = String.format("/submission/%s", submissionId);

    try {
      HttpResponse<String> response = this.makeRequest(path);
      Logger.printRed(response.statusCode());

      if (response.statusCode() == 200) {
        try {
          return objectMapper.readValue(response.body(), SubmissionDTO.class);
        } catch (Exception exception) {
          throw new SubmissionRequestException(String.format("Unable to parse submission: %s", submissionId));
        }
      } else {
        throw new SubmissionRequestException(String.format("Unable to fetch submission: %s", submissionId));
      }
    } catch (Exception exception) {
      exception.printStackTrace();
      throw new SubmissionRequestException(String.format("Unable to make submission request: %s", submissionId));
    }
  }
}
