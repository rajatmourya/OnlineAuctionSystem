package com.oas.biddingservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "bids")
public class Bid {

    @Id
    private String id;

    private String auctionId;
    private String bidderId;
    private double bidAmount;
    private Instant bidTime;
    
 // getters & setters
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getAuctionId() {
		return auctionId;
	}
	public void setAuctionId(String auctionId) {
		this.auctionId = auctionId;
	}
	public String getBidderId() {
		return bidderId;
	}
	public void setBidderId(String bidderId) {
		this.bidderId = bidderId;
	}
	public double getBidAmount() {
		return bidAmount;
	}
	public void setBidAmount(double bidAmount) {
		this.bidAmount = bidAmount;
	}
	public Instant getBidTime() {
		return bidTime;
	}
	public void setBidTime(Instant bidTime) {
		this.bidTime = bidTime;
	}

    
}
