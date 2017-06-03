package com.example;

import com.example.repository.EsRepository;
import com.example.service.DemoService;
import org.elasticsearch.index.reindex.ScrollableHitSource;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.HashMap;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

	@Autowired
	private DemoService demoService;

	@Autowired
	private EsRepository esRepository;

	@Test
	public void test1() {
		HashMap<String, Object> result = esRepository.findSongWithPrefix("시그");


		SearchHit [] hits = (SearchHit [])result.get("contentsList");
		System.out.println("Total : " + result.get("total"));
		System.out.println("Song Name : " + hits[0].getSource().get("name"));
	}



}
