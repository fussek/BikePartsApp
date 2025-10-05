package com.casestudy.bikepartsapi.repository;

import com.casestudy.bikepartsapi.model.BikePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BikePartRepository extends JpaRepository<BikePart, Long> {
    /**
     * Finds the single bike part with the highest article number.
     * Spring Data JPA automatically creates the query from the method name.
     * @return an Optional containing the BikePart with the max article number, or empty if the table is empty.
     */
    Optional<BikePart> findTopByOrderByArticleNumberDesc();
}