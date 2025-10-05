package com.casestudy.bikepartsapi.config;

import com.casestudy.bikepartsapi.model.BikePart;
import com.casestudy.bikepartsapi.repository.BikePartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private BikePartRepository bikePartRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bikePartRepository.count() == 0) {
            BikePart part1 = new BikePart(null, 100000L, "KMC X11 Bicycle Chain", "Chain", "Road, MTB, Gravel", "Nickel", 257);
            BikePart part2 = new BikePart(null, 100001L, "Ritchey Comp Curve Handlebar", "Handlebar", "Road, Gravel", "Alloy", 300);
            BikePart part3 = new BikePart(null, 100002L, "SRAM GX Eagle DUB Crankset", "Crank", "MTB", "Aluminium", 620);
            BikePart part4 = new BikePart(null, 100003L, "SRAM PG-1170 Cassette 11-28", "Cassette", "Road, Gravel", "Steel", 247);
            BikePart part5 = new BikePart(null, 100004L, "Selle Italia Model X Saddle", "Saddle", "Road, MTB, Gravel", "Plastic", 315);
            BikePart part6 = new BikePart(null, 100005L, "Shimano 105 HB-R7000 Front Hub", "Hub", "Road, Gravel", "Aluminium", 155);
            BikePart part7 = new BikePart(null, 100006L, "Shimano BB-UN300 Bottom Bracket", "Bottom Bracket", "City, Trekking", "Steel", 280);
            BikePart part8 = new BikePart(null, 100007L, "Shimano XT M8100 12-Speed Shifter", "Shifter", "e-MTB, MTB", "Aluminium", 120);
            BikePart part9 = new BikePart(null, 100008L, "TRP Spyre Mechanical Disc Brake Caliper", "Brake Lever", "Road, Gravel, Cargo", "Aluminium", 154);
            BikePart part10 = new BikePart(null, 100009L, "Brooks B17 Standard Saddle", "Saddle", "Trekking, City, Foldable", "Leather", 520);
            BikePart part11 = new BikePart(null, 100010L, "Race Face Aeffect R 35 Handlebar", "Handlebar", "MTB, e-MTB", "Alloy", 335);
            BikePart part12 = new BikePart(null, 100011L, "DT Swiss 350 Hybrid Hub", "Hub", "e-MTB, e-Trekking", "Aluminium", 405);
            BikePart part13 = new BikePart(null, 100012L, "Praxis Works Zayante Carbon M30 Crank", "Crank", "Road, Gravel", "Carbon", 622);
            BikePart part14 = new BikePart(null, 100013L, "Cane Creek eeWings Titanium Crankset", "Crank", "MTB, Gravel", "Titanium", 400);
            BikePart part15 = new BikePart(null, 100014L, "Magura MT7 Pro HC Disc Brake Lever", "Brake Lever", "e-MTB, e-Cargo bike", "Aluminium", 255);
            BikePart part16 = new BikePart(null, 100015L, "Ergon GP1 Handlebar Grips", "Handlebar", "City, Trekking, Foldable", "Rubber", 180);
            BikePart part17 = new BikePart(null, 100016L, "KMC E11 EPT E-Bike Chain", "Chain", "e-City, e-Trekking, e-MTB", "Steel", 268);
            BikePart part18 = new BikePart(null, 100017L, "SRAM XG-1299 Eagle AXS Cassette", "Cassette", "MTB, e-MTB", "Titanium", 350);
            BikePart part19 = new BikePart(null, 100018L, "FSA MegaEvo BSA Threaded Bottom Bracket", "Bottom Bracket", "Cargo, e-Cargo bike", "Steel", 102);
            BikePart part20 = new BikePart(null, 100019L, "Shimano SW-EM800-L STEPS e-Bike Shifter", "Shifter", "e-MTB, e-Trekking", "Plastic", 35);
            BikePart part21 = new BikePart(null, 100020L, "Shimano Deore RD-M6100 Rear Derailleur", "Derailleur", "MTB", "Alloy", 320);
            BikePart part22 = new BikePart(null, 100021L, "RockShox ZEB Ultimate Fork", "Derailleur", "e-MTB, MTB", "Aluminium", 2259); // Technically a fork, but fits category for example
            BikePart part23 = new BikePart(null, 100022L, "Fox Transfer Factory Dropper Post", "Saddle", "MTB, Gravel", "Alloy", 550); // Seatpost, related to saddle
            BikePart part24 = new BikePart(null, 100023L, "Chris King NoThreadSet Headset", "Handlebar", "Road, MTB, Gravel", "Steel", 98); // Headset, related to handlebar
            BikePart part25 = new BikePart(null, 100024L, "Gates Carbon Drive CDX Belt", "Chain", "City, e-City, Cargo", "Carbon", 80);
            BikePart part26 = new BikePart(null, 100025L, "Bosch PowerTube 625Wh Battery", "Shifter", "e-MTB, e-City, e-Cargo bike", "Plastic", 3500); // E-bike specific, categorized under shifter for simplicity
            BikePart part27 = new BikePart(null, 100026L, "Rohloff Speedhub 500/14", "Hub", "Trekking, Cargo", "Aluminium", 1700);
            BikePart part28 = new BikePart(null, 100027L, "SON Delux 12 Dynamo Hub", "Hub", "Trekking, Road, Gravel", "Aluminium", 390);
            BikePart part29 = new BikePart(null, 100028L, "Pinion C1.12 Gearbox", "Bottom Bracket", "Trekking, e-Trekking", "Alloy", 2100);
            BikePart part30 = new BikePart(null, 100029L, "Syntace Flatforce Stem", "Handlebar", "MTB", "Titanium", 119);
            BikePart part31 = new BikePart(null, 100030L, "Shimano Dura-Ace Di2 R9250 Shifter", "Shifter", "Road", "Carbon", 220);

            List<BikePart> allParts = Arrays.asList(
                part1, part2, part3, part4, part5, part6, part7, part8, part9, part10,
                part11, part12, part13, part14, part15, part16, part17, part18, part19, part20,
                part21, part22, part23, part24, part25, part26, part27, part28, part29, part30,
                part31
            );

            bikePartRepository.saveAll(allParts);
            System.out.println("Database seeded with " + allParts.size() + " bike parts.");
        }
    }
}

