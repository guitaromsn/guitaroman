import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Gemini AI Agent for ZATCA Scrap Business App
 * Provides intelligent assistance for business operations
 */
class GeminiAgent {
  constructor(apiKey = null) {
    // In production, this would be loaded from environment variables or secure storage
    this.apiKey = apiKey || process.env.REACT_APP_GEMINI_API_KEY;
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.model = null;
    
    if (this.genAI) {
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }

    // Initialize contexts for different business domains
    this.contexts = {
      scrapMetal: this.buildScrapMetalContext(),
      zatca: this.buildZATCAContext(),
      invoice: this.buildInvoiceContext(),
      customer: this.buildCustomerContext()
    };
  }

  /**
   * Check if AI is available
   * @returns {boolean} - True if AI is configured and available
   */
  isAvailable() {
    return this.model !== null;
  }

  /**
   * Generate intelligent suggestions for scrap item details
   * @param {string} description - Item description
   * @returns {Promise<Object>} - AI-generated suggestions
   */
  async suggestScrapItemDetails(description) {
    if (!this.isAvailable()) {
      return this.getFallbackScrapItemSuggestions(description);
    }

    try {
      const prompt = `${this.contexts.scrapMetal}

Based on the item description "${description}", provide intelligent suggestions for:
1. Category (ferrous, non-ferrous, e-waste, demolition, precious, automotive)
2. Appropriate unit of measurement (kg, ton, piece, gram, meter, liter)
3. Estimated price range in Saudi Riyal (SAR)
4. Arabic translation
5. Quality grades (if applicable)
6. Market demand level (high, medium, low)

Respond in JSON format:
{
  "category": "suggested_category",
  "unit": "suggested_unit",
  "priceRange": {"min": 0, "max": 0},
  "arabicName": "arabic_translation",
  "qualityGrades": ["grade1", "grade2"],
  "marketDemand": "demand_level",
  "notes": "additional_notes"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn('Failed to parse AI response, using fallback');
        return this.getFallbackScrapItemSuggestions(description);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      return this.getFallbackScrapItemSuggestions(description);
    }
  }

  /**
   * Validate and improve invoice data using AI
   * @param {Object} invoiceData - Invoice data to validate
   * @returns {Promise<Object>} - Validation results and suggestions
   */
  async validateInvoiceData(invoiceData) {
    if (!this.isAvailable()) {
      return this.getFallbackInvoiceValidation(invoiceData);
    }

    try {
      const prompt = `${this.contexts.invoice}
${this.contexts.zatca}

Review this invoice data for ZATCA compliance and business best practices:
${JSON.stringify(invoiceData, null, 2)}

Provide validation results in JSON format:
{
  "isValid": true/false,
  "zatcaCompliant": true/false,
  "errors": ["list of critical errors"],
  "warnings": ["list of warnings"],
  "suggestions": ["list of improvement suggestions"],
  "missingFields": ["list of missing required fields"],
  "vatValidation": {
    "correct": true/false,
    "calculatedVat": 0,
    "notes": "vat calculation notes"
  }
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.getFallbackInvoiceValidation(invoiceData);
      }
    } catch (error) {
      console.error('Error validating invoice:', error);
      return this.getFallbackInvoiceValidation(invoiceData);
    }
  }

  /**
   * Generate customer insights and suggestions
   * @param {Object} customerData - Customer information
   * @param {Array} transactionHistory - Past transactions
   * @returns {Promise<Object>} - Customer insights
   */
  async generateCustomerInsights(customerData, transactionHistory = []) {
    if (!this.isAvailable()) {
      return this.getFallbackCustomerInsights(customerData, transactionHistory);
    }

    try {
      const prompt = `${this.contexts.customer}

Analyze this customer data and transaction history:
Customer: ${JSON.stringify(customerData, null, 2)}
Transactions: ${JSON.stringify(transactionHistory, null, 2)}

Provide customer insights in JSON format:
{
  "riskLevel": "low/medium/high",
  "creditworthiness": "excellent/good/fair/poor",
  "paymentPattern": "description",
  "preferredItems": ["list of frequently purchased items"],
  "averageOrderValue": 0,
  "totalRevenue": 0,
  "recommendations": ["business recommendations"],
  "nextBestAction": "suggested next action",
  "alerts": ["any alerts or concerns"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.getFallbackCustomerInsights(customerData, transactionHistory);
      }
    } catch (error) {
      console.error('Error generating customer insights:', error);
      return this.getFallbackCustomerInsights(customerData, transactionHistory);
    }
  }

  /**
   * Generate business insights and reports
   * @param {Object} businessData - Business metrics and data
   * @returns {Promise<Object>} - Business insights
   */
  async generateBusinessInsights(businessData) {
    if (!this.isAvailable()) {
      return this.getFallbackBusinessInsights(businessData);
    }

    try {
      const prompt = `Analyze this Saudi Arabian scrap metal business data:
${JSON.stringify(businessData, null, 2)}

Provide comprehensive business insights in JSON format:
{
  "performance": {
    "revenue_trend": "increasing/stable/decreasing",
    "growth_rate": 0,
    "seasonal_patterns": "description"
  },
  "market_analysis": {
    "top_performing_categories": [],
    "underperforming_areas": [],
    "price_trends": "analysis"
  },
  "recommendations": {
    "short_term": [],
    "long_term": [],
    "cost_optimization": [],
    "revenue_growth": []
  },
  "alerts": [],
  "kpi_summary": {
    "customer_satisfaction": "high/medium/low",
    "operational_efficiency": "percentage",
    "market_position": "description"
  }
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        return JSON.parse(text);
      } catch (parseError) {
        return this.getFallbackBusinessInsights(businessData);
      }
    } catch (error) {
      console.error('Error generating business insights:', error);
      return this.getFallbackBusinessInsights(businessData);
    }
  }

  /**
   * Smart search and filtering assistance
   * @param {string} query - Search query
   * @param {Array} data - Data to search through
   * @param {string} context - Context for search (customers, items, invoices)
   * @returns {Promise<Array>} - Filtered and ranked results
   */
  async smartSearch(query, data, context) {
    if (!this.isAvailable() || !query || !data.length) {
      return this.getFallbackSearch(query, data, context);
    }

    try {
      // For demo purposes, we'll use a simpler approach
      // In production, you might use embeddings and semantic search
      return this.getFallbackSearch(query, data, context);
    } catch (error) {
      console.error('Error in smart search:', error);
      return this.getFallbackSearch(query, data, context);
    }
  }

  // Context builders for different business domains
  buildScrapMetalContext() {
    return `You are an expert in the Saudi Arabian scrap metal industry. You understand:
- Different types of scrap metals: ferrous (steel, iron, cast iron), non-ferrous (aluminum, copper, brass, lead), precious metals (gold, silver, platinum)
- Electronic waste (e-waste): computers, phones, circuit boards, cables
- Demolition materials: structural steel, rebar, pipes, window frames
- Automotive scrap: engines, radiators, catalytic converters, transmission units
- Current market prices in Saudi Arabia (SAR)
- Quality grades and specifications
- Local regulations and environmental considerations
- Arabic translations for common terms`;
  }

  buildZATCAContext() {
    return `You are an expert in ZATCA (Zakat, Tax and Customs Authority) regulations for Saudi Arabia:
- E-invoicing requirements and compliance
- VAT calculations (standard 15% rate)
- Required invoice fields and formats
- QR code requirements
- XML format specifications (UBL 2.1)
- Digital signature requirements
- B2B vs B2C transaction differences
- Compliance validation rules`;
  }

  buildInvoiceContext() {
    return `You are an expert in business invoicing and financial processes:
- Invoice validation and error detection
- Mathematical accuracy checks
- Required fields for different transaction types
- Payment terms and conditions
- Currency formatting and calculations
- Due date calculations
- Credit terms and risk assessment`;
  }

  buildCustomerContext() {
    return `You are an expert in customer relationship management for B2B businesses:
- Customer risk assessment
- Payment behavior analysis
- Purchase pattern recognition
- Customer segmentation strategies
- Credit worthiness evaluation
- Business relationship optimization
- Revenue maximization strategies`;
  }

  // Fallback methods for when AI is not available
  getFallbackScrapItemSuggestions(description) {
    const lowerDesc = description.toLowerCase();
    
    // Simple keyword-based categorization
    let category = 'ferrous';
    if (lowerDesc.includes('aluminum') || lowerDesc.includes('copper') || lowerDesc.includes('brass')) {
      category = 'non-ferrous';
    } else if (lowerDesc.includes('computer') || lowerDesc.includes('phone') || lowerDesc.includes('electronic')) {
      category = 'e-waste';
    } else if (lowerDesc.includes('car') || lowerDesc.includes('engine') || lowerDesc.includes('radiator')) {
      category = 'automotive';
    }

    const basePrices = {
      ferrous: { min: 0.50, max: 1.20 },
      'non-ferrous': { min: 5.00, max: 30.00 },
      'e-waste': { min: 10.00, max: 50.00 },
      automotive: { min: 50.00, max: 1000.00 },
      demolition: { min: 0.60, max: 900.00 }
    };

    return {
      category,
      unit: category === 'e-waste' ? 'piece' : 'kg',
      priceRange: basePrices[category] || { min: 1.00, max: 10.00 },
      arabicName: '', // Would need translation service
      qualityGrades: ['Grade A', 'Grade B'],
      marketDemand: 'medium',
      notes: 'Basic categorization based on keywords'
    };
  }

  getFallbackInvoiceValidation(invoiceData) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Basic validation checks
    if (!invoiceData.customer) {
      errors.push('Customer information is required');
    }

    if (!invoiceData.items || invoiceData.items.length === 0) {
      errors.push('At least one item is required');
    }

    if (!invoiceData.totalAmount || invoiceData.totalAmount <= 0) {
      errors.push('Valid total amount is required');
    }

    // VAT validation
    const expectedVat = (invoiceData.subtotal || 0) * 0.15;
    const actualVat = invoiceData.vatAmount || 0;
    const vatDifference = Math.abs(expectedVat - actualVat);
    
    let vatValidation = {
      correct: vatDifference < 0.01,
      calculatedVat: expectedVat,
      notes: vatDifference < 0.01 ? 'VAT calculation is correct' : 'VAT calculation may be incorrect'
    };

    if (vatDifference >= 0.01) {
      warnings.push('VAT amount seems incorrect based on 15% rate');
    }

    return {
      isValid: errors.length === 0,
      zatcaCompliant: errors.length === 0 && warnings.length === 0,
      errors,
      warnings,
      suggestions,
      missingFields: [],
      vatValidation
    };
  }

  getFallbackCustomerInsights(customerData, transactionHistory) {
    const totalRevenue = transactionHistory.reduce((sum, t) => sum + (t.amount || 0), 0);
    const averageOrder = transactionHistory.length > 0 ? totalRevenue / transactionHistory.length : 0;
    
    return {
      riskLevel: totalRevenue > 50000 ? 'low' : totalRevenue > 10000 ? 'medium' : 'high',
      creditworthiness: 'fair',
      paymentPattern: 'Analysis not available without AI',
      preferredItems: [],
      averageOrderValue: averageOrder,
      totalRevenue,
      recommendations: ['Enable AI integration for detailed insights'],
      nextBestAction: 'Review customer transaction history',
      alerts: []
    };
  }

  getFallbackBusinessInsights(businessData) {
    return {
      performance: {
        revenue_trend: 'stable',
        growth_rate: 0,
        seasonal_patterns: 'Analysis requires AI integration'
      },
      market_analysis: {
        top_performing_categories: [],
        underperforming_areas: [],
        price_trends: 'Enable AI for market analysis'
      },
      recommendations: {
        short_term: ['Enable AI integration for insights'],
        long_term: ['Implement comprehensive data analytics'],
        cost_optimization: [],
        revenue_growth: []
      },
      alerts: [],
      kpi_summary: {
        customer_satisfaction: 'medium',
        operational_efficiency: '75%',
        market_position: 'Analysis requires AI integration'
      }
    };
  }

  getFallbackSearch(query, data, context) {
    if (!query || !data.length) return data;

    const searchTerms = query.toLowerCase().split(' ');
    
    return data.filter(item => {
      const searchableText = JSON.stringify(item).toLowerCase();
      return searchTerms.some(term => searchableText.includes(term));
    }).slice(0, 20); // Limit results
  }

  /**
   * Get AI configuration status
   * @returns {Object} - Configuration status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      configured: !!this.apiKey,
      model: this.model ? 'gemini-pro' : null,
      features: {
        scrapItemSuggestions: this.isAvailable(),
        invoiceValidation: this.isAvailable(),
        customerInsights: this.isAvailable(),
        businessInsights: this.isAvailable(),
        smartSearch: this.isAvailable()
      }
    };
  }
}

export default GeminiAgent;
