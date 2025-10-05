package com.casestudy.bikepartsapi.controller;

import com.casestudy.bikepartsapi.service.BikePartService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BikePartController.class)
public class BikePartControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BikePartService bikePartService;

    @Test
    public void getNextArticleNumber_shouldReturnNumberFromService() throws Exception {
        Long expectedNumber = 100031L;
        when(bikePartService.getNextArticleNumber()).thenReturn(expectedNumber);

        mockMvc.perform(get("/api/v1/bikeparts/next-article-number"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").value(expectedNumber));
    }
}