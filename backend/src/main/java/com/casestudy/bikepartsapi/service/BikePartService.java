package com.casestudy.bikepartsapi.service;

import com.casestudy.bikepartsapi.exception.ResourceNotFoundException;
import com.casestudy.bikepartsapi.model.BikePart;
import com.casestudy.bikepartsapi.repository.BikePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BikePartService {

    @Autowired
    private BikePartRepository bikePartRepository;

    public List<BikePart> getAllBikeParts() {
        return bikePartRepository.findAll();
    }

    public BikePart getBikePartById(Long id) {
        return bikePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BikePart not found with id: " + id));
    }

    public BikePart createBikePart(BikePart bikePart) {
        return bikePartRepository.save(bikePart);
    }

    public BikePart updateBikePart(Long id, BikePart bikePartDetails) {
        BikePart existingBikePart = getBikePartById(id);

        existingBikePart.setArticleNumber(bikePartDetails.getArticleNumber());
        existingBikePart.setName(bikePartDetails.getName());
        existingBikePart.setArticleCategory(bikePartDetails.getArticleCategory());
        existingBikePart.setBicycleCategory(bikePartDetails.getBicycleCategory());
        existingBikePart.setMaterial(bikePartDetails.getMaterial());
        existingBikePart.setNetWeight(bikePartDetails.getNetWeight());

        return bikePartRepository.save(existingBikePart);
    }

    public void deleteBikePart(Long id) {
        BikePart bikePart = getBikePartById(id);
        bikePartRepository.delete(bikePart);
    }

    /**
     * Calculates the next available article number.
     * @return The highest existing article number + 1, or a default starting number if no articles exist.
     */
    public Long getNextArticleNumber() {
        Optional<BikePart> lastPart = bikePartRepository.findTopByOrderByArticleNumberDesc();
        return lastPart.map(part -> part.getArticleNumber() + 1L).orElse(180000L); //default article nr
    }
}