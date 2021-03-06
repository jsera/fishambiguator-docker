var should = require("chai").should();
var expect = require("chai").expect;
var request = require("supertest");
var db = require("../models/");
var assert = require("assert");

describe("Fish name tests", function() {
	var testFish = null;
	var testGenus = null;
	var testGenusName = "Fishy";
	var testSpeciesName = "Fishy"
	var testScientificName = testGenusName+" "+testSpeciesName;
	var testCommonNames = ["Spiny Lumpsucker", "Tiny cute fish"];
	var lowercaseCommonNames = testCommonNames.map(function(name) {
		return name.trim().toLowerCase();
	});

	before(function(done) {
		db.fish.create({}).then(function(fish) {
			testFish = fish;
			db.genus.findOrCreate({where:{name:testGenusName}}).spread(function(genus) {
				testGenus = genus;
				done();
			});
		});
	});

	it("Should be able to add a fish to a genus", function(done) {
		testGenus.addFish(testFish).then(function() {
			done();
		});
	});

	it("Should be able to remove a fish from a genus", function(done) {
		testGenus.removeFish(testFish).then(function() {
			done();
		});
	});

	it("Should set and get scientific names", function(done) {
		testFish.setScientificName(testScientificName)
		.then(function(fish) {
			testFish.getScientificName().then(function(name) {
				expect(name).to.equal(testScientificName.toLowerCase());
				done();
			});
		})
		.error(function(error) {
			throw new Error(error);
		});
	});

	it("Should get scientific name synchronously when genus is eagerly loaded", function(done) {
		db.fish.find({
			where: {
				id: testFish.id
			},
			include: [db.genus]
		}).then(function(fish) {
			expect(fish.getScientificName()).to.equal(testScientificName.toLowerCase());
			done();
		});
	});

	it("Should be able to set common names as a comma-delimited string", function(done) {
		testFish.commonnames = testCommonNames.join(",");
		testFish.save().then(function() {
			done();
		});
	});

	it("Should be able to read common names as a comma-delimited string", function(done) {
		db.fish.find({
			where: {
				id: testFish.id
			}
		}).then(function(fish) {
			expect(fish.commonnames).to.equal(lowercaseCommonNames.join(","));
			done();
		});
	});

	it("Should trim common names", function(done) {
		var goofyNames = ["   \n\nSpiny Lumpsucker", "A Fish\n\n\n   \t  \n\n", "\t\t\t\t\t\t\n\n    something else\n  \n  \t"];
		var nonGoofyNames = goofyNames.map(function(name) {
			return name.trim().toLowerCase();
		});
		testFish.commonnames = goofyNames.join(",");
		testFish.save().then(function() {
			db.fish.find({
				where: {
					id: testFish.id
				}
			}).then(function(fish) {
				expect(fish.commonnames).to.equal(nonGoofyNames.join(","));
				// undo our change
				fish.commonnames = testCommonNames.join(",");
				fish.save().then(function() {
					done();
				});
			});
		});
	});

	it("Should be able to find by scientific name", function(done) {
		db.fish.findByScientificName(testScientificName).then(function(fish) {
			assert(fish != null, "Should get results for name: "+testScientificName);
			assert(fish.length == 1, "Should get one result");
			var result = fish[0].get();
			assert(result.commonnames == lowercaseCommonNames.join(","), "Common names should be what we expect");
			//
			done();
		});
	});

	it("Should be able to find by common name", function(done) {
		db.fish.findByCommonName(testCommonNames[0]).then(function(fish) {
			assert(fish != null, "Should get results for name: "+testScientificName);
			assert(fish.length == 1, "Should get one result");
			var result = fish[0].get();
			assert(result.commonnames == lowercaseCommonNames.join(","), "Common names should be what we expect");
			//
			done();
		});
	});

	it("Should be able to update a fish's common names from an object", function(done) {
		var originalCommon = testFish.commonnames;
		db.fish.updateFish(testFish.id, {
			commonnames: "test,names"
		}).then(function(fish) {
			assert(fish != null, "Fish should not be null");
			assert(fish.commonnames == "test,names");
			// reset!
			fish.commonnames = originalCommon;
			fish.save().then(function() {
				done();
			});
		});
	});

	it("Should be able to update the species name", function(done) {
		var originalSpecies = testSpeciesName;
		console.log("********** testFish: ", testFish.get());
		db.fish.updateFish(testFish.id, {
			scientificname: testGenusName+" splishy"
		}).then(function(fish) {
			assert(fish != null, "Fish shouldn't be null");
			assert(fish.genusId === testGenus.id, "Genus should remain the same");
			assert(fish.getScientificName() == testGenusName.toLowerCase()+" splishy");
			// reset!
			fish.species = originalSpecies;
			fish.save().then(function() {
				done();
			});
		});
	});

	it("Should be able to change the genus name by updating the fish", function(done) {
		db.fish.updateFish(testFish.id, {
			scientificname: "splishy splishy"
		}).then(function(fish) {
			assert(fish != null, "Fish shouldn't be null");
			assert(fish.genus.name === "splishy", "Genus name should have changed");
			//
			db.genus.find({
				where: {
					name: "splishy"
				}
			}).then(function (genus) {
				assert(genus != null, "Genus splishy should be findable");
				// reset!
				db.fish.updateFish(testFish.id, {
					scientificname: testScientificName
				}).then(function() {
					genus.destroy().then(function() {
						done();
					});
				});
			});
		});
	});

	it("Should be able to change common and scientific names simultaneously", function(done) {
		// TODO: test changing common and scientific names at the same time
		done();
	});

	after(function(done) {
		if (testFish) {
			var destroyFish = function() {
				testFish.destroy().then(function() {
					done();
				});
			};
			if (testGenus) {
				testGenus.destroy().then(destroyFish);
			} else {
				destroyFish();
			}
		}
	});
});

describe("Fish creation and update tests", function() {
	var testFish = null;
	var testGenus = null;

	it("Should be able to use newFish on the model class to create a new fish", function(done) {
		db.fish.newFish({
			commonnames: "foo, bar",
			scientificName: "fooius barrius"
		}).then(function(fish) {
			assert(fish != null, "New fish is not null");
			testFish = fish;
			assert(fish.commonnames == "foo,bar", "New fish has the proper common names");
			assert(fish.species = "barrius", "New fish has the right species name");
			fish.getGenus().then(function(genus) {
				assert(genus.name == "fooius", "New fish has the right genus");
				testGenus = genus;
				done();
			});
		});
	});

	after(function(done) {
		if (testFish) {
			var destroyFish = function() {
				testFish.destroy().then(function() {
					done();
				});
			};
			if (testGenus) {
				testGenus.destroy().then(destroyFish);
			} else {
				destroyFish();
			}
		}
	})
});