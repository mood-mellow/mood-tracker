package com.moodtracker.backend.service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.PublishResponse;

@Service
public class NotificationService {

    private final SnsClient snsClient;
    private final String topicArn = "arn:aws:sns:us-east-1:285529797250:MellowReminder";

    public NotificationService(SnsClient snsClient) {
        this.snsClient = snsClient;
    }

    public void sendDailyReminder(String message) {
        PublishRequest request = PublishRequest.builder()
                .message(message)
                .topicArn(topicArn)
                .build();

        PublishResponse response = snsClient.publish(request);
        System.out.println("SNS MessageId: " + response.messageId());
    }
}
