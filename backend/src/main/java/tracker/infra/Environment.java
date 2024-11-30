package tracker.infra;

public class Environment {
  private static String getFromEnv(String key) {
    String value = System.getenv(key);

    if (value == null)
      throw new IllegalArgumentException("La variable de entorno '" + key + "' no está definida.");

    return value;
  }

  public static String getFrontendUrl() {
    return getFromEnv("FRONTEND_URL");
  }

  public static String getMongoDatabase() {
    return getFromEnv("MONGO_DB");
  }

  public static String getAuthSecretKey() {
    return getFromEnv("BACKEND_AUTH_SECRET_KEY");
  }

  public static String getAuthRegistrationKey() {
    return getFromEnv("BACKEND_AUTH_REGISTRATION_KEY");
  }
}
