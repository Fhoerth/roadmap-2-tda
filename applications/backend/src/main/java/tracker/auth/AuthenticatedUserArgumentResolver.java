package tracker.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import tracker.models.User;

@Component
public class AuthenticatedUserArgumentResolver implements HandlerMethodArgumentResolver {
  private final AuthenticatedUserComponent authenticatedUser;

  @Autowired
  public AuthenticatedUserArgumentResolver(AuthenticatedUserComponent authenticatedUser) {
    this.authenticatedUser = authenticatedUser;
  }

  @Override
  public boolean supportsParameter(@NonNull MethodParameter parameter) {
    return parameter.getParameterAnnotation(AuthenticatedUser.class) != null
        && parameter.getParameterType().equals(User.class);
  }

  @Override
  public Object resolveArgument(@NonNull MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
      @Nullable NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) {
    return authenticatedUser.getUser();
  }
}
