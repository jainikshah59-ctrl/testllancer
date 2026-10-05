import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function CleoLaunchPanel() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 glass rounded-2xl max-w-2xl mx-auto mt-10 border border-gray-100"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-accent/10 rounded-xl">
          <Sparkles className="w-6 h-6 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Collancer AI (Cleo)</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Cleo is your AI assistant. It helps with creator discovery, campaign planning, and answers your questions using deterministic local retrieval.
      </p>
      
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Ask Cleo..." 
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-accent"
          />
          <button className="px-6 py-2 bg-foreground text-white rounded-xl font-medium hover:bg-black/80 transition-colors">
            Ask
          </button>
        </div>
      </div>
    </motion.div>
  );
}
