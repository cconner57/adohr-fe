#!/bin/bash

# Define the API endpoint (deployed Cloudflare API)
API_URL="https://api.adohr.app/applications/surrender"

# Define the payload based on SurrenderApplication in backend/internal/data/surrender.go
PAYLOAD='{
  "firstName": "Test",
  "lastName": "Surrenderer",
  "phoneNumber": "555-0123",
  "email": "test-surrender@example.com",
  "streetAddress": "789 Surrender St",
  "city": "Rescue City",
  "state": "CA",
  "zipCode": "90210",
  "whenToSurrenderAnimal": "As soon as possible",
  "animalName": "Fluffy",
  "animalSex": "Female",
  "animalAge": "3 years",
  "animalOwnershipDuration": "2 years",
  "animalLocationFound": "Shelter",
  "animalWhySurrendered": "Moving to a no-pet apartment",
  "householdMembers": [
    {
      "age": "30",
      "gender": "Female",
      "count": 1
    }
  ],
  "otherPetsInHousehold": "None",
  "fax_number": "",
  "animalsBehaviorTowardsKnownPeople": "Friendly",
  "animalsBehaviorTowardsStrangers": "Shy but sweet",
  "animalsBehaviorTowardsKnownAnimals": "Plays well",
  "commentsOnBehavior": "Very gentle cat",
  "animalsReactionToNewPeople": "Hides initially",
  "animalHouseTrained": "Yes",
  "animalSpendMajorityOfTime": "Indoors",
  "animalLeftAloneDuration": "8 hours",
  "animalWhenLeftAlone": "Sleeps",
  "animalLeftAloneBehaviors": "None",
  "animalHowItPlays": "Gently",
  "animalToysItLikes": "Feather wands",
  "animalGamesItLikes": "Hide and seek",
  "animalScaredOfAnything": "Vacuum cleaners",
  "animalScaredOfAnythingExplanation": "Runs away when it starts",
  "animalBadHabits": "None",
  "animalAllowedOnFurniture": "Yes",
  "animalSleepAtNight": "At the foot of the bed",
  "animalBehaviorFoodOthers": "Protective",
  "animalBehaviorToysOthers": "Shares",
  "animalProblemsRidingInCar": "No",
  "animalProblemsRidingInCarExplanation": "",
  "animalEscapedBefore": "No",
  "animalEscapedBeforeExplanation": "",
  "animalEverAttackedPeople": "No",
  "animalEverAttackedPeopleExplanation": "",
  "animalEverAttackedOtherCats": "No",
  "animalEverAttackedOtherCatsExplanation": "",
  "animalEverAttackedOtherDogs": "No",
  "animalEverAttackedOtherDogsExplanation": "",
  "animalVeterinarianList": "Local Pet Clinic",
  "animalVeterinarianYearlyVisits": "Yes",
  "animalSpayedNeutered": "Yes",
  "animalVaccinationHistory": "Up to date",
  "animalVaccinationsCurrent": "Yes",
  "animalTestedHeartworm": "No",
  "animalTestedHeartwormExplanation": "",
  "animalHeartwormPrevention": "No",
  "animalHeartwormPreventionExplanation": "",
  "animalMicrochipped": "Yes",
  "animalMicrochippedExplanation": "Registered to current owner",
  "animalVetOrGroomerBehavior": "Well-behaved",
  "animalVetMuzzled": "No",
  "animalPastOrPresentHealthProblems": "None",
  "animalPastOrPresentHealthProblemsExplanation": "",
  "animalCurrentMedications": "None",
  "animalCurrentMedicationsExplanation": "",
  "animalTypeOfFood": "Dry kibble",
  "animalEatingFrequency": "Twice a day",
  "animalAmountOfFood": "1/2 cup",
  "animalFoodTreats": "Yes",
  "animalFoodTreatsExplanation": "Temptations",
  "additionalInformation": "Fluffy is a wonderful cat looking for a new home."
}'

# Perform the POST request
echo "Submitting surrender application to $API_URL..."
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$API_URL")

echo "Response:"
echo "$RESPONSE"

# Check if the response contains success (Backend returns 201 Created and {"message": "... success ..."} or similar)
if echo "$RESPONSE" | grep -q "successfully"; then
  echo "SUCCESS: Surrender application submitted successfully."
else
  echo "FAILURE: Surrender application submission failed."
  exit 1
fi
