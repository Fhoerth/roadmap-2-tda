package tracker.scripts;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import tracker.interfaces.MongoScript;
import tracker.repositories.KeyRepository;
import tracker.services.KeyService;
import tracker.utils.Logger;

@Component
public class V3__SecretKey implements MongoScript {
  private KeyService keyService;
  private KeyRepository keyRepository;

  private String name = "v3__secret-key";
  private String id = "v3__secret-key";

  @Autowired
  public V3__SecretKey(KeyService keyService, KeyRepository keyRepository) {
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

  public String getId() {
    return id;
  }

  public String getName() {
    return name;
  }
}
