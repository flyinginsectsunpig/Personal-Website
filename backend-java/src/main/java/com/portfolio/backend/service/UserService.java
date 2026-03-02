package com.portfolio.backend.service;

import com.portfolio.backend.dto.UserRequest;
import com.portfolio.backend.dto.UserResponse;
import java.util.List;

public interface UserService {
  UserResponse create(UserRequest request);

  List<UserResponse> findAll();

  UserResponse findById(Long id);

  UserResponse update(Long id, UserRequest request);

  void delete(Long id);
}
