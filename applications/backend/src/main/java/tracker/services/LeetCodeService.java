package tracker.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tracker.DTO.LeetCodeErrorDTO;
import tracker.DTO.SubmissionDTO;
import tracker.exceptions.LeetCodeServiceForwardedException;
import tracker.exceptions.LeetCodeServiceRequestException;
import tracker.exceptions.LeetCodeServiceResponseException;
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

  private HttpResponse<String> makeRequest(String path)
      throws LeetCodeServiceForwardedException, LeetCodeServiceRequestException {
    String url = String.format("%s%s", this.leetCodeServiceApiUrl, path);
    Logger.printPurple(url);

    try {
      HttpRequest request = HttpRequest.newBuilder().uri(new URI(url)).header("Accept", "application/json").GET()
          .build();

      HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

      if (response.statusCode() == 200) {
        return response;
      } else {
        String responseBody = response.body();

        if (responseBody != null && !responseBody.isEmpty()) {
          try {
            LeetCodeErrorDTO leetCodeError = objectMapper.readValue(responseBody, LeetCodeErrorDTO.class);
            throw new LeetCodeServiceForwardedException(leetCodeError.getStatus(), leetCodeError.getMessage());
          } catch (JsonProcessingException parseException) {
            throw new LeetCodeServiceResponseException(
                String.format("Unable to parse response for status %d: %s", response.statusCode(), responseBody));
          }
        } else {
          throw new LeetCodeServiceForwardedException(response.statusCode(),
              String.format("Empty response for status %d", response.statusCode()));
        }
      }
    } catch (URISyntaxException uriSyntaxException) {
      throw new LeetCodeServiceRequestException(String.format("Invalid URI: %s", url));
    } catch (IOException | InterruptedException requestException) {
      throw new LeetCodeServiceRequestException(String.format("Unable to make request: %s", url));
    }
  }

  public SubmissionDTO fetchSubmission(String submissionId)
      throws LeetCodeServiceForwardedException, LeetCodeServiceRequestException {
    String path = String.format("/submission/%s", submissionId);

    HttpResponse<String> response = this.makeRequest(path);
    Logger.printRed(response.statusCode());

    try {
      return objectMapper.readValue(response.body(), SubmissionDTO.class);
    } catch (Exception exception) {
      throw new LeetCodeServiceResponseException(String.format("Unable to parse submission: %s", submissionId));
    }
  }
}
