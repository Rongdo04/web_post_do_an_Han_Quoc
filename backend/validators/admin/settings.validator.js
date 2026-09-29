// validators/admin/settings.validator.js
import validator from "validator";

function validateOptionalUrl(fieldName, value, errors, label) {
  if (value === undefined) return;
  if (value === "" || value === null) return;
  if (typeof value !== "string") {
    errors[fieldName] = `${label} must be a string`;
  } else if (value.trim().length === 0) {
    // allow empty after trim as clear
    return;
  } else if (value.length > 500) {
    errors[fieldName] = `${label} URL must not exceed 500 characters`;
  } else if (!validator.isURL(value, { protocols: ["http", "https"] })) {
    errors[fieldName] = `${label} must be a valid URL`;
  }
}

// Validate settings update request
export function validateUpdateSettings(req, res, next) {
  const {
    siteTitle,
    siteDesc,
    brand,
    policy,
    logoUrl,
    heroImage,
    footerImage,
  } = req.body;
  const errors = {};

  if (siteTitle !== undefined) {
    if (!siteTitle || typeof siteTitle !== "string") {
      errors.siteTitle = "Site title is required and must be a string";
    } else if (siteTitle.trim().length === 0) {
      errors.siteTitle = "Site title cannot be empty";
    } else if (siteTitle.length > 100) {
      errors.siteTitle = "Site title must not exceed 100 characters";
    } else if (siteTitle.length < 3) {
      errors.siteTitle = "Site title must be at least 3 characters long";
    }
  }

  if (siteDesc !== undefined) {
    if (!siteDesc || typeof siteDesc !== "string") {
      errors.siteDesc = "Site description is required and must be a string";
    } else if (siteDesc.trim().length === 0) {
      errors.siteDesc = "Site description cannot be empty";
    } else if (siteDesc.length > 500) {
      errors.siteDesc = "Site description must not exceed 500 characters";
    } else if (siteDesc.length < 10) {
      errors.siteDesc = "Site description must be at least 10 characters long";
    }
  }

  if (brand !== undefined) {
    if (!brand || typeof brand !== "string") {
      errors.brand = "Brand name is required and must be a string";
    } else if (brand.trim().length === 0) {
      errors.brand = "Brand name cannot be empty";
    } else if (brand.length > 50) {
      errors.brand = "Brand name must not exceed 50 characters";
    } else if (brand.length < 2) {
      errors.brand = "Brand name must be at least 2 characters long";
    } else if (!/^[\p{L}\p{N}\s\-_&.]+$/u.test(brand)) {
      errors.brand = "Brand name contains invalid characters";
    }
  }

  if (policy !== undefined) {
    if (!policy || typeof policy !== "string") {
      errors.policy = "Policy text is required and must be a string";
    } else if (policy.trim().length === 0) {
      errors.policy = "Policy text cannot be empty";
    } else if (policy.length > 5000) {
      errors.policy = "Policy text must not exceed 5000 characters";
    } else if (policy.length < 20) {
      errors.policy = "Policy text must be at least 20 characters long";
    }
  }

  validateOptionalUrl("logoUrl", logoUrl, errors, "Logo");
  validateOptionalUrl("heroImage", heroImage, errors, "Banner image");
  validateOptionalUrl("footerImage", footerImage, errors, "Footer image");

  const providedFields = [
    siteTitle,
    siteDesc,
    brand,
    policy,
    logoUrl,
    heroImage,
    footerImage,
  ].filter((field) => field !== undefined);

  if (providedFields.length === 0) {
    errors.general = "At least one field must be provided for update";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Settings validation failed",
        details: errors,
      },
    });
  }

  next();
}

export function validateFieldFormats(data) {
  const errors = {};

  ["siteTitle", "siteDesc", "brand", "policy", "logoUrl", "heroImage", "footerImage"].forEach(
    (field) => {
      if (data[field] && /<script|javascript:|on\w+=/i.test(data[field])) {
        errors[field] = `${field} contains potentially harmful content`;
      }
    },
  );

  return errors;
}

export function sanitizeSettingsData(data) {
  const sanitized = {};

  if (data.siteTitle !== undefined) {
    sanitized.siteTitle = validator.escape(data.siteTitle.toString().trim());
  }

  if (data.siteDesc !== undefined) {
    sanitized.siteDesc = validator.escape(data.siteDesc.toString().trim());
  }

  if (data.brand !== undefined) {
    sanitized.brand = validator.escape(data.brand.toString().trim());
  }

  if (data.policy !== undefined) {
    sanitized.policy = data.policy.toString().trim();
  }

  // Keep image URLs unescaped so they remain valid
  ["logoUrl", "heroImage", "footerImage"].forEach((field) => {
    if (data[field] !== undefined) {
      sanitized[field] = data[field].toString().trim();
    }
  });

  return sanitized;
}
