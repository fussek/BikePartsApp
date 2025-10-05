package com.casestudy.bikepartsapi.service;

import com.casestudy.bikepartsapi.model.BikePart;
import com.casestudy.bikepartsapi.repository.BikePartRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BikePartServiceTest {

    @Mock
    private BikePartRepository bikePartRepository;

    @InjectMocks
    private BikePartService bikePartService;

    @Test
    public void getNextArticleNumber_shouldReturnNextNumber_whenPartsExist() {
        BikePart lastBikePart = new BikePart();

        lastBikePart.setArticleNumber(300030L);
        
        when(bikePartRepository.findTopByOrderByArticleNumberDesc()).thenReturn(Optional.of(lastBikePart));

        Long nextArticleNumber = bikePartService.getNextArticleNumber();

        assertEquals(300031L, nextArticleNumber);
    }

    @Test
    public void getNextArticleNumber_shouldReturnDefaultNumber_whenNoPartsExist() {
        when(bikePartRepository.findTopByOrderByArticleNumberDesc()).thenReturn(Optional.empty());

        Long nextArticleNumber = bikePartService.getNextArticleNumber();

        // Assert: Check if the result is the default starting number.
        assertEquals(180000L, nextArticleNumber);
    }
}