package com.casestudy.bikepartsapi.repository;

import com.casestudy.bikepartsapi.model.BikePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BikePartRepository extends JpaRepository<BikePart, Long> {
}
