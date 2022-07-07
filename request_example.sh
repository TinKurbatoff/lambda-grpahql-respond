#!/bin/bash
AWS_URL=$1
curl -X POST https://$AWS_URL/default/graphql-new-test \
			-H "content-type: application/json" \
			--data-raw "{\"query\":\"query (\$address: String, \$city: String) {\n  addrListItems (primary_lane: \$address, city: \$city) {\n    status\n    message\n    itemsCount\n    data {\n formatted_street_address\n      city\n      state\n      latitude\n      longitude\n    }\n  }\n}\n \",\"variables\":{\"city\":\"OAKLAND\",\"address\":\"777 W\"}}" 
