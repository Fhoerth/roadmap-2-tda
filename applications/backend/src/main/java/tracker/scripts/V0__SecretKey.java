package tracker.scripts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.repositories.KeyRepository;
import tracker.services.security.KeyService;
import tracker.utils.Logger;

@Component
public class V0__SecretKey implements MongoScript {
  private String name = "v0__SecretKey";
  private String id = "v0__SecretKey";

  private KeyService keyService;
  private KeyRepository keyRepository;

  @Autowired
  public V0__SecretKey(KeyService keyService, KeyRepository keyRepository) {
    this.keyService = keyService;
    this.keyRepository = keyRepository;
  }

  @Override
  public boolean run() {
    long count = keyRepository.count();

    if (count == 1) {
      Logger.printPurple("A unique key already exists. No insertion needed.");

      return false;
    } else {
      try {
        String secretKey = keyService.generateAndStoreSignedSecretKey();
        Logger.printGreen("Key created successfully");
        Logger.printGreen(secretKey);

        return true;
      } catch (Exception e) {
        Logger.printRed("Key failed to be generated.");
        e.printStackTrace();

        return false;
      }
    }
  }

  @Override
  public String getId() {
    return id;
  }

  @Override
  public String getName() {
    return name;
  }
}
