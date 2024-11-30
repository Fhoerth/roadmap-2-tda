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
}
