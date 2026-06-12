#!/bin/bash

# Define the API endpoint (deployed Cloudflare API)
API_URL="https://api.adohr.app/applications/adoption"

# Define the FULL payload based on FormState in src/stores/adoption.ts
PAYLOAD='{
  "firstName": "Test",
  "lastName": "Adopter",
  "age": 30,
  "email": "test-adopter@example.com",
  "address": "456 Test Lane",
  "city": "Test Town",
  "state": "CA",
  "zip": "90210",
  "phoneNumber": "555-0199",
  "adultMembersAgreed": "Yes",
  "homeType": "House",
  "homeOwnership": "Own",
  "breedRestrictionsWeightLimit": "None",
  "monthlyFee": "No",
  "allergies": "No",
  "primaryOwner": "Self",
  "yearsAtAddress": "5",
  "previousAddress": "None",
  "expectToMove": "No",
  "travelPlan": "Pet sitter",
  "catAccess": "Full house",
  "catIndoorOutdoor": "Indoor Only",
  "catPreferenceBreed": "Any",
  "catPreferencePhysical": "None",
  "catPreferencePersonality": "Friendly",
  "catPreferenceNotWant": "Aggressive",
  "whyInterested": "I love cats.",
  "adoptionReason": "Companionship",
  "ownCatBefore": "Yes",
  "ownKittenBefore": "Yes",
  "alreadyHaveVeterinarian": "Yes",
  "catAllowedHomeArea": "Everywhere",
  "catHomeAloneHours": "4",
  "catDisciplineType": "Positive reinforcement",
  "catEscapeSteps": "Keep doors closed",
  "currentlyHavePets": "No",
  "currentPets": [],
  "ownPetsBefore": "No",
  "pastPets": [],
  "bredAnimalDescription": "None",
  "ownedDeclawedOrDebarked": "No",
  "movedWithPet": "Yes",
  "ownedSpecialNeedsPet": "No",
  "mobilityDevice": "No",
  "foodTypeBrand": "Premium",
  "surrenderConditions": ["Extreme allergies"],
  "surrenderPlan": "Return to ADOHR",
  "affordVetCare": "Yes",
  "affordEmergencyCost": "Yes",
  "homeTourSubmitted": true,
  "agreementSignature1": "Test Adopter",
  "agreementSignature2": "Test Adopter",
  "agreementSignature3": "Test Adopter",
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "fax_number": ""
}'

# Perform the POST request
echo "Submitting FULL adoption application to $API_URL..."
RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$PAYLOAD" "$API_URL")

echo "Response:"
echo "$RESPONSE"

# Check if the response contains success
if echo "$RESPONSE" | grep -q "success"; then
  echo "SUCCESS: Adoption application submitted successfully."
else
  echo "FAILURE: Adoption application submission failed."
  exit 1
fi
