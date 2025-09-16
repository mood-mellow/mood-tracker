package com.moodtracker.backend.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FriendRequestService {

    private final DynamoDbClient dynamoDbClient;
    private static final String TABLE_NAME = "FriendRequests";

    public FriendRequestService(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public void saveFriendRequest(String senderId, String receiverId, String message) {
        String requestId = UUID.randomUUID().toString();

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("RequestId", AttributeValue.builder().s(requestId).build());
        item.put("SenderId", AttributeValue.builder().s(senderId).build());
        item.put("ReceiverId", AttributeValue.builder().s(receiverId).build());
        item.put("Message", AttributeValue.builder().s(message).build());
        item.put("Status", AttributeValue.builder().s("PENDING").build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(TABLE_NAME)
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
    }
}
