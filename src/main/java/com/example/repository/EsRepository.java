package com.example.repository;

import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.client.Client;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHits;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by doohwan.yoo on 2017. 6. 4..
 */
@Repository
public class EsRepository {
    private Client client;

    @Autowired
    public EsRepository(Client client) {
        this.client = client;
    }

    public HashMap<String, Object> findSongWithPrefix(String prefix) {

        SearchResponse response = client.prepareSearch("meta")
                .setTypes("song")
                .setSearchType(SearchType.DFS_QUERY_THEN_FETCH)
                .setQuery(QueryBuilders.prefixQuery("name", prefix))
                .setFrom(0).setSize(20).setExplain(true)
                .get();

        SearchHits hits = response.getHits();

        HashMap<String ,Object> result = new HashMap<>();

        result.put("total", hits.getTotalHits());
        result.put("contentsList", hits.getHits());

        return result;
    }
}
