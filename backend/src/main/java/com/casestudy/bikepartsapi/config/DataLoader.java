package com.casestudy.bikepartsapi.config;

import com.casestudy.bikepartsapi.model.BikePart;
import com.casestudy.bikepartsapi.repository.BikePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private BikePartRepository bikePartRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bikePartRepository.count() == 0) {
            BikePart part1 = new BikePart(null, 180099L, "KMC X11 Bicycle Chain", "Chain", "Road, Mountain, Gravel", "Nickel", 257);
            BikePart part2 = new BikePart(null, 200068L, "Ritchey Comp Curve Handlebar", "Handlebar", "Road, Gravel", "Alloy", 300);
            BikePart part3 = new BikePart(null, 120025L, "SRAM GX Eagle DUB Crankset", "Crank arm", "Mountain, Enduro", "Aluminium", 620);
            BikePart part4 = new BikePart(null, 170077L, "SRAM PG-1170 Cassette 11-28", "Cassette", "Road, Gravel", "Steel", 247);
            BikePart part5 = new BikePart(null, 190054L, "Selle Italia Model X Saddle", "Saddle", "Road, Mountain, Gravel", "Plastic", 315);
            BikePart part6 = new BikePart(null, 110010L, "Shimano 105 HB-R7000 Front Hub", "Hub", "Road, Gravel", "Aluminium", 155);
            BikePart part7 = new BikePart(null, 130045L, "Shimano BB-UN300 Bottom Bracket", "Bottom Bracket", "City, Trekking", "Steel", 280);

            bikePartRepository.saveAll(Arrays.asList(part1, part2, part3, part4, part5, part6, part7));
            System.out.println("Database seeded with 7 bike parts.");
        }
    }
}
