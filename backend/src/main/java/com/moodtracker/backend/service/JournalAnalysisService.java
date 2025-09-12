package com.moodtracker.backend.service;

import com.moodtracker.backend.dto.JournalAnalysisResult;

import opennlp.tools.tokenize.TokenizerME;
import opennlp.tools.tokenize.TokenizerModel;
import opennlp.tools.postag.POSModel;
import opennlp.tools.postag.POSTaggerME;

import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.*;

@Service
public class JournalAnalysisService {
    private final TokenizerME tokenizer;
    private final POSTaggerME posTagger;

    public JournalAnalysisService() throws Exception {
        try (InputStream tokenModelIn = getClass().getResourceAsStream("/model/opennlp-en-ud-ewt-tokens-1.3-2.5.4.bin");
             InputStream posModelIn = getClass().getResourceAsStream("/model/opennlp-en-ud-ewt-pos-1.3-2.5.4.bin")
        ) {
            if (tokenModelIn == null || posModelIn == null) {
                throw new IllegalStateException("OpenNLP model files not in resources/model/");
            }
            TokenizerModel tokenModel = new TokenizerModel(tokenModelIn);
             tokenizer = new TokenizerME(tokenModel);

             POSModel posModel = new POSModel(posModelIn);
             posTagger = new POSTaggerME(posModel);
        }
    }

    public JournalAnalysisResult analyze(String journalText) {
        String[] tokens = tokenizer.tokenize(journalText);
        String[] tags = posTagger.tag(tokens);

        int posCount = 0;
        int negCount = 0;
        Set<String> keywords = new HashSet<>();

        for (int i = 0; i < tokens.length; i++) {
            String word = tokens[i].toLowerCase();
            String tag = tags[i];

            // Extracting keywords
            if (tag.startsWith("NN") || tag.startsWith("JJ")) {
                keywords.add(word);
            }

            // Tiny sentiment lexicon
            if (Set.of("happy", "good", "love", "great", "excited").contains(word)) posCount++;
            if (Set.of("sad", "bad", "angry", "tired", "stressed").contains(word)) negCount++;
        }

        String mood;
        double score = posCount - negCount;
        if (score > 0) mood = "positive";
        else if (score < 0) mood = "negative";
        else mood = "neutral";

        return new JournalAnalysisResult(mood, score, new ArrayList<>(keywords));
    }
}
