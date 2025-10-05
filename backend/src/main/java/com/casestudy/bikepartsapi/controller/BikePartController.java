package com.casestudy.bikepartsapi.controller;

import com.casestudy.bikepartsapi.model.BikePart;
import com.casestudy.bikepartsapi.service.BikePartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // To allow requests from React frontend
@RestController
@RequestMapping("/api/v1/bikeparts")
public class BikePartController {

    @Autowired
    private BikePartService bikePartService;

    @GetMapping
    public List<BikePart> getAllBikeParts() {
        return bikePartService.getAllBikeParts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BikePart> getBikePartById(@PathVariable(value = "id") Long id) {
        BikePart bikePart = bikePartService.getBikePartById(id);
        return ResponseEntity.ok().body(bikePart);
    }

    @PostMapping
    public BikePart createBikePart(@Valid @RequestBody BikePart bikePart) {
        return bikePartService.createBikePart(bikePart);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BikePart> updateBikePart(@PathVariable(value = "id") Long id,
                                                   @Valid @RequestBody BikePart bikePartDetails) {
        BikePart updatedBikePart = bikePartService.updateBikePart(id, bikePartDetails);
        return ResponseEntity.ok(updatedBikePart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBikePart(@PathVariable(value = "id") Long id) {
        bikePartService.deleteBikePart(id);
        return ResponseEntity.ok().build();
    }
}
