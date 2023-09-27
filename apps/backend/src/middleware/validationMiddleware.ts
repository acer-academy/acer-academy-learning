import { LevelEnum, SubjectEnum, TransactionType } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { CentreService } from '../services/CentreService';
import { ClassroomService } from '../services/ClassroomService';
import { FaqArticleService } from '../services/FaqArticleService';
import { FaqTopicService } from '../services/FaqTopicService';
import { TeacherService } from '../services/TeacherService';
import promotionService from '../services/PromotionService';
import transactionService from '../services/TransactionService';
import { CreditBundleService } from '../services/CreditBundleService';

const teacherService = new TeacherService();
const centreService = new CentreService();
const classroomService = new ClassroomService();
const faqArticleService = new FaqArticleService();
const faqTopicService = new FaqTopicService();
const creditBundleService = new CreditBundleService();

/*
 * Validators Naming Convention: (Expand on as we code)
 *
 * Action Verb:
 * - restrict: To restrict or remove certain fields.
 * - validate: To validate the presence, uniqueness, or format of data.
 *
 * Type:
 * - Body: For validators that operate on the request body.
 * - Params: For validators that operate on request parameters.
 *
 * Entity Name (Optional, for disambiguation):
 * - Example: "validateBodyTeacherEmailUnique" vs "validateBodyStudentEmailUnique"
 *
 * Field Name(s) + Check(s):
 * - Contains name of field(s) being validated, and their respective check(s).
 * - Example: "EmailUnique", "SubjectExist", "FirstNameLastNameNotEmpty"
 *
 * - Note that plurality of field(s) and their corresponding checks matter.
 * - Example: "validateBodySubjectExists" vs "validateBodySubjectsExist"
 * - First implies a single subject check, the other checks all subjects in an array.
 */

/** Remove email field if present in request body */
export async function restrictBodyEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body.email) {
      delete req.body.email;
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Remove id field if present in request body */
export async function restrictBodyId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body.id) {
      delete req.body.id;
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a teacher email passed in body already exists */
export async function validateBodyTeacherEmailUnique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    const existingTeacher = await teacherService.getTeacherByEmail(email);
    if (existingTeacher) {
      return res.status(400).json({
        error: 'Email already exists.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a teacherId passed in params exists */
// export async function validateParamsTeacherExists(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const { teacherId } = req.params;
//     const teacherExists = await teacherService.getTeacherById(teacherId);
//     if (!teacherExists || !teacherId) {
//       return res.status(400).json({
//         error: 'Teacher does not exist.',
//       });
//     }
//     next();
//   } catch (error) {
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// }

/** Validates if a centreId passed in params exists */
export async function validateParamsCentreExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { centreId } = req.params;
    if (centreId) {
      const centreExists = await centreService.getCentreById(centreId);
      if (!centreExists) {
        return res.status(400).json({
          error: 'Centre does not exist.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a single level enum passed in params exists */
export async function validateParamsLevelExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { level } = req.params;
    const validLevel = Object.values(LevelEnum).includes(level as LevelEnum);
    if (!validLevel) {
      return res.status(400).json({
        error: 'Invalid level provided.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a single subject enum passed in params exists */
export async function validateParamsSubjectExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { subject } = req.params;
    const validSubject = Object.values(SubjectEnum).includes(
      subject as SubjectEnum,
    );
    if (!validSubject) {
      return res.status(400).json({
        error: 'Invalid subject provided.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if firstName and lastName passed in body is not empty */
export async function validateBodyFirstNameLastNameNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { firstName, lastName } = req.body;
    if (
      (firstName && firstName.trim() === '') ||
      (lastName && lastName.trim() === '')
    ) {
      return res.status(400).json({
        error:
          'First name and last name cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if an array of level enums passed in body all exist */
export async function validateBodyLevelsExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { levels } = req.body;
    if (levels) {
      const validLevels = levels.every((level) =>
        Object.values(LevelEnum).includes(level),
      );
      if (!validLevels) {
        return res.status(400).json({
          error: 'Invalid levels provided.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if an array of subject enums passed in body all exist */
export async function validateBodySubjectsExist(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { subjects } = req.body;
    if (subjects) {
      const validSubjects = subjects.every((subject) =>
        Object.values(SubjectEnum).includes(subject),
      );
      if (!validSubjects) {
        return res.status(400).json({
          error: 'Invalid subjects provided.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a centreId passed in body exists */
export async function validateBodyCentreExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { centreId } = req.body;
    if (centreId) {
      const centreExists = await centreService.getCentreById(centreId);
      if (!centreExists) {
        return res.status(400).json({
          error: 'Centre does not exist.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if centre's name and address passed in body is not empty */
export async function validateBodyCentreNameAddressNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, address } = req.body;
    if (name.trim().length == 0 || address.trim().length == 0) {
      return res.status(400).json({
        error: 'Name and address cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if centre's name and address passed in body are both unique */
export async function validateBodyCentreNameAddressUnique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, address } = req.body;
    const existingCentreByName = await centreService.getCentreByName(name);
    const existingCentreByAddress = await centreService.getCentreByAddress(
      address,
    );
    if (existingCentreByName) {
      return res.status(400).json({
        error: 'Centre with this name already exists.',
      });
    }
    if (existingCentreByAddress) {
      return res.status(400).json({
        error: 'Centre with this address already exists.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a centre is deletable; deletion is not allowed if FK constraint fails */
export async function validateParamsCentreDeletable(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { centreId } = req.params;
    const teachersInCentre = await teacherService.getTeachersByCentre(centreId);
    if (teachersInCentre.length > 0) {
      return res.status(400).json({
        error:
          'Centre cannot be deleted. Teachers associated with this centre still exist.',
      });
    }
    const classroomsInCentre = await classroomService.getClassroomsByCentre(
      centreId,
    );
    if (classroomsInCentre.length > 0) {
      return res.status(400).json({
        error:
          'Centre cannot be deleted. Classrooms associated with this centre still exist.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a classroomId passed in params exists */
export async function validateParamsClassroomExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { classroomId } = req.params;
    const classroomExists = await classroomService.getClassroomById(
      classroomId,
    );
    if (!classroomExists || !classroomId) {
      return res.status(400).json({
        error: 'Classroom does not exist.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if name passed in body is not empty */
export async function validateBodyClassroomNameNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body;
    if (name.trim() === '') {
      return res.status(400).json({
        error: 'Classroom name cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if capacity passed in body is a positive integer */
export async function validateBodyClassroomCapacity(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { capacity } = req.body;
    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        error: 'Classroom capacity must be a positive integer.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if FAQ article's title and body passed in body is not empty */
export async function validateBodyFaqArticleTitleBodyNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title, body } = req.body;
    if (title.trim() === '' || body.trim() === '') {
      return res.status(400).json({
        error: 'Title and body cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a faqTopicId passed in body exists */
export async function validateBodyFaqTopicExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { faqTopicId } = req.body;
    if (faqTopicId) {
      const faqTopicExists = await faqTopicService.getFaqTopicById(faqTopicId);
      if (!faqTopicExists) {
        return res.status(400).json({
          error: 'FAQ Topic does not exist.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a faqArticleId passed in params exists */
export async function validateParamsFaqArticleExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { faqArticleId } = req.params;
    const articleExists = await faqArticleService.getFaqArticleById(
      faqArticleId,
    );
    if (!articleExists || !faqArticleId) {
      return res.status(400).json({
        error: 'FAQ article does not exist.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if FAQ topic's title passed in body is not empty */
export async function validateBodyFaqTopicTitleNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title } = req.body;
    if (title.trim() === '') {
      return res.status(400).json({
        error: 'Title cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a title passed in body is unique */
export async function validateBodyFaqTopicTitleUnique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { title } = req.body;
    const existingTopicByTitle = await faqTopicService.getFaqTopicByTitle(
      title,
    );
    if (existingTopicByTitle) {
      return res.status(400).json({
        error: 'FAQ Topic with this title already exists.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a faqTopicId passed in params exists */
export async function validateParamsFaqTopicExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { faqTopicId } = req.params;
    const topicExists = await faqTopicService.getFaqTopicById(faqTopicId);
    if (!topicExists || !faqTopicId) {
      return res.status(400).json({
        error: 'FAQ topic does not exist.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Check if date in correct format */
export async function validateDateFormat(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const postgresDatetimeRegex =
      /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2}))$/;
    let isValidStartDate, isValidEndDate, isValidDateTime;

    isValidStartDate = req.body.startDate
      ? postgresDatetimeRegex.test(req.body.startDate)
      : true;
    isValidEndDate = req.body.endDate
      ? postgresDatetimeRegex.test(req.body.endDate)
      : true;

    isValidDateTime = req.body.dateTime
      ? postgresDatetimeRegex.test(req.body.dateTime)
      : true;

    if (!isValidStartDate || !isValidEndDate || !isValidDateTime) {
      return res.status(500).json({
        error: 'Inputed date(s) does not comply with Postgres DateTime format',
      });
    }

    if (req.body.startDate >= req.body.endDate) {
      return res.status(500).json({
        error: 'Start Date must be a date earlier than End Date',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Check if discount for promotion in 2dp */
export async function validatePromotionDescription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body.description) {
      return res.status(500).json({
        error: 'Percentage Description cannot be empty',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Check if promotion description not empty */
export async function validatePromotionPercentageDiscount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.body.percentageDiscount) {
      let checkType = parseFloat(req.body.percentageDiscount);
      if (!checkType) {
        return res.status(500).json({
          error: 'Percentage Discount needs to be numbers',
        });
      }
      let check = req.body.percentageDiscount.toString().split('.');
      if (check[1] && check[1].length > 2) {
        return res.status(500).json({
          error:
            'Percentage Discount should only consist of max 2 decimal points',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function validatePromotionPromoCodeUnique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { promoCode } = req.body;
    const { id } = req.params;
    const existingPromotion = await promotionService.getPromotionByPromoCode(
      promoCode,
    );
    if (existingPromotion && existingPromotion.id !== id) {
      return res.status(400).json({
        error: 'Promotion Code already exists.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function validateDeleteTermNoTransactions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { termId } = req.params;
    const transactions = await transactionService.getTransactionsByTerm(termId);
    if (transactions.length > 0) {
      return res.status(400).json({
        error: 'Unable to delete term due to prior transactions',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

export async function validateTransactionType(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { transactionType } = req.body;
    const validTransaction = Object.values(TransactionType).includes(
      transactionType as TransactionType,
    );
    if (transactionType && !validTransaction) {
      return res.status(400).json({ error: 'Invalid Transaction Type' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function validatePurchaseTransaction(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { transactionType, amount, currency } = req.body;
    if (transactionType && transactionType === TransactionType.PURCHASED) {
      console.log('inside');
      if (!amount || !currency) {
        return res
          .status(400)
          .json({ error: 'Please input amount and currency' });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function validateTransactionComplusoryFields(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { transactionType, termId, studentId, dateTime, creditsTransacted } =
      req.body;
    if (
      !transactionType ||
      !termId ||
      !studentId ||
      !dateTime ||
      !creditsTransacted
    ) {
      return res
        .status(400)
        .json({ error: 'Please input all fields before proceeding' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/** Validates if a creditBundleId passed in params exists */
export async function validateParamsCreditBundleExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { creditBundleId } = req.params;
    if (creditBundleId) {
      const creditBundleExists = await creditBundleService.getCreditBundleById(
        creditBundleId,
      );
      if (!creditBundleExists) {
        return res.status(400).json({
          error: 'Credit bundle does not exist.',
        });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if a name passed in body is unique */
export async function validateBodyCreditBundleNameUnique(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body;
    const existingCreditBundleByName =
      await creditBundleService.getCreditBundleByName(name);
    if (existingCreditBundleByName) {
      return res.status(400).json({
        error: 'Credit bundle with this name already exists.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if name passed in body is not empty */
export async function validateBodyCreditBundleNameNotEmpty(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name } = req.body;
    if (name && name.trim() === '') {
      return res.status(400).json({
        error: 'Name cannot be empty or contain only whitespace.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if number of credits in credit bundle is positive */
export async function validateBodyCreditBundleNumCreditsPositive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { numCredits } = req.body;
    if (numCredits <= 0) {
      return res.status(400).json({
        error: 'Number of credits must be at least 1.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if base price of credit bundle is positive */
export async function validateBodyCreditBundleBasePricePositive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { basePrice } = req.body;
    if (basePrice <= 0) {
      return res.status(400).json({
        error: 'Base price must be positive.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}

/** Validates if credit bundle is active */
export async function validateCreditBundleIsActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { isActive } = req.body;
    if (!isActive) {
      return res.status(400).json({
        error: 'Credit bundle is inactive.',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
